import { Injectable, ɵConsole } from "@angular/core";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Config } from "src/app/config.module";
import LoginResult from "src/models/auth/LoginResult";
import RefreshToken from "src/models/security/RefreshToken";
import { AccountView, LoginView } from "src/models/views/auth/AuthView";
import { RequestService } from "../request/RequestService";
import { UserService } from "../user/user.service";

enum MethodsAuth {
  LOGIN = "login",
  REFRESH = "refresh",
  LOGOUT = "logout",
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private readonly jwtHelper: JwtHelperService;
  private readonly keyStorage = "auth";
  private readonly apiUrl = Config.API_URL + "/Authentification";
  identity: AccountView;

  constructor(private req: RequestService, private userService: UserService) {
    this.jwtHelper = new JwtHelperService();
    this.userService.myIdentity.subscribe((identity: AccountView) => {
      this.identity = identity;
    });
  }

  public async loginUserAsync(login: LoginView): Promise<LoginResult> {
    //Prepare data to send back end
    var data = new LoginView();
    data.email = login.email;
    data.password = login.password;
    data.AddressIP = await this.req.getAddressIP();

    //Execute request post to login
    var url = this.apiUrl + "/" + MethodsAuth.LOGIN;
    var result: LoginResult = await this.req.executePost<
      LoginView,
      LoginResult
    >(url, data);

    //If not undefined store tokens
    if (
      result != undefined &&
      result.jwtToken != undefined &&
      result.refreshToken != undefined
    ) {
      await this.setLocalStorageAsync(this.keyStorage, result);
    }
    return result;
  }

  public async logoutUserAsync(): Promise<boolean> {
    //If user is auth call back end to logout and remove local tokens
    if (await this.isAuthenticatedAsync()) {
      var result = await this.req.executePost<any, any>(
        this.apiUrl + "/" + MethodsAuth.LOGOUT
      );
      this.removeLocalStorage(this.keyStorage);
      return true;
    }
    this.removeLocalStorage(this.keyStorage);
    return false;
  }

  public getAuth(): LoginResult {
    return this.getLocalStorage<LoginResult>(this.keyStorage);
  }

  public async isAuthenticatedAsync(): Promise<boolean> {
    var auth = this.getAuth();
    var currentTimeSecond = Date.now() / 1000;

    console.log(currentTimeSecond);

    //if no tokens store
    if (auth == undefined) return false;

    console.log(auth);
    console.log(auth.jwtToken.expireAt);
    //if jwt token exist and expiration is valid
    if (
      auth.jwtToken != undefined &&
      auth.jwtToken.expireAt > currentTimeSecond
    ) {
      if (this.identity == undefined) {
        await this.userService.onSetAuthAsync();
      }
      return true;
    }

    console.log(auth.refreshToken.expireAt);
    //if jwt token not exist or not valid and refresh token exist and is valid
    if (
      auth.refreshToken != undefined &&
      auth.refreshToken.expireAt > currentTimeSecond
    ) {
      //execute post request to generate new jwt token
      var result = await this.req.executePost<RefreshToken, LoginResult>(
        this.apiUrl + "/" + MethodsAuth.REFRESH,
        auth.refreshToken
      );
      console.log(result);
      //If not undefined store tokens
      if (
        result != undefined &&
        result.jwtToken != undefined &&
        result.refreshToken != undefined
      )
        await this.setLocalStorageAsync(this.keyStorage, result);
      else {
        this.removeLocalStorage(this.keyStorage);
      }

      //retry to return a valid jwt token recursive
      return await this.isAuthenticatedAsync();
    }

    //no valid tokens (jwt and refresh) no auth found
    this.removeLocalStorage(this.keyStorage);
    return false;
  }

  private async setLocalStorageAsync<T>(key: string, obj: T) {
    localStorage.setItem(key, JSON.stringify(obj));
    await this.userService.onSetAuthAsync();
  }

  private removeLocalStorage(key: string): void {
    localStorage.removeItem(key);
    this.userService.onRemoveAuth();
  }

  private getLocalStorage<T>(key: string): T {
    var json = localStorage.getItem(key);
    try {
      //try parse json
      var parse = JSON.parse(json);
      //try cast json object to object T
      return parse as T;
    } catch (error) {
      //on fail parse or cast
      console.error("Error when try to parse or cast local storage object");
      console.error(error);
      return undefined;
    }
  }
}

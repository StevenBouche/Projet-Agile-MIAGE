import { LoginData } from './../../../data/auth/auth-data';
import { HttpService } from './../request/http.service';
import { LoginResult, JwtToken } from './../../../models/auth/auth-model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private httpService: HttpService) {}

  setAccessToken(token: JwtToken) {
    localStorage.setItem('access_token', token.accessToken);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  get isLoggedIn(): boolean {
    const authToken = localStorage.getItem('access_token');
    return authToken !== null ? true : false;
  }

  doLogout(): void {
    const removeToken = localStorage.removeItem('access_token');
    if (removeToken == null) {
      // TODO : this.router.navigate(['log-in']);
    }
  }

  login(loginData: LoginData): Observable<LoginResult> {
    return this.httpService.login(loginData);
  }
}

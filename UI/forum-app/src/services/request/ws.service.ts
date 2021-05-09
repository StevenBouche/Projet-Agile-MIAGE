import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { HubConnection } from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { Config } from 'src/app/config.module';
import LoginResult from 'src/models/auth/LoginResult';
import DeleteChannelForm from 'src/models/forum/DeleteChannelForm';
import ForumView from 'src/models/forum/ForumView';
import MessageView from 'src/models/forum/MessageView';
import RegisterChannelResult from 'src/models/forum/RegisterChannelResult';
import RegisterMessage from 'src/models/forum/RegisterMessage';
import SubscribeResultView from 'src/models/forum/SubscribeResultView';
import { AuthService } from '../auth/auth.service';
import { NotificationService } from '../notification/notification.service';

@Injectable({
  providedIn: 'root'
})
export class WsService {

  private readonly urlServer = Config.API_WS+"/forumhub"
  private connection : HubConnection;
  private msg : MessageView;

  private _isConnected = new BehaviorSubject<boolean>(false);

  private dataStore: {
    isConnected  : boolean
  } = {
    isConnected  : false
  }; // store our data in memory

  readonly isConnected = this._isConnected.asObservable()

  constructor(private auth : AuthService, private alert: NotificationService) {

  }

  public async connectToWebSocketAsync() {

    var isAuth : boolean = await this.auth.isAuthenticatedAsync();

      if(!isAuth) return;

      var loginResult : LoginResult = this.auth.getAuth();

      //console.log(`${this.urlServer}?token=${loginResult.jwtToken.accessToken}`)

      //create new hub
      this.connection =  new signalR.HubConnectionBuilder()
                              .withUrl(`${this.urlServer}?token=${loginResult.jwtToken.accessToken}`)
                              .configureLogging(signalR.LogLevel.Information)
                              .build();
       //Init events websocket
      this.initEventWebSocket(this.connection);

      //start connection
      this.connection.start().then((value:any) => {
          console.log("connected")
          this.dataStore.isConnected = true;
          this._isConnected.next(true);
      }).catch((error:any) => {
          this.alert.showError(error,"Error");
          console.log("connect error : "+error)
          this.dataStore.isConnected = false;
          this._isConnected.next(false);
      })

  }

  public disconnectWebSocket() {

    if(this.connection!=undefined&&this.connection.connectionId != null) {

      this.connection.stop().then((value:any) => { console.log("disconnected") })
      .catch((error:any) => {
        this.alert.showError(error,"Error");
        console.log("connect error : "+error)
      })
    } else  {
      console.log("disconnect websocket : already disconnect")
    }

    this.dataStore.isConnected = false;
    this._isConnected.next(false);

  }

  private _onNewForum = new BehaviorSubject<ForumView>(undefined);
  readonly onNewForum = this._onNewForum.asObservable()

  private _onNewMessage = new BehaviorSubject<RegisterMessage>(undefined);
  readonly onNewMessage = this._onNewMessage.asObservable()

  private _onNewCategorie = new BehaviorSubject<RegisterChannelResult>(undefined);
  readonly onNewCategorie= this._onNewCategorie.asObservable()

  private _onUserConnect = new BehaviorSubject<string>(undefined);
  readonly onUserConnect = this._onUserConnect.asObservable()

  private _onUserDisconnect = new BehaviorSubject<string>(undefined);
  readonly onUserDisconnect = this._onUserDisconnect.asObservable()

  private _onUserSubscribe = new BehaviorSubject<SubscribeResultView>(undefined);
  readonly onUserSubscribe = this._onUserSubscribe.asObservable()

  private _onChannelDeleted = new BehaviorSubject<DeleteChannelForm>(undefined);
  readonly onChannelDeleted = this._onChannelDeleted.asObservable()

  private initEventWebSocket(connection : HubConnection) : void {

    connection.onclose(async (callback:any) => {
      console.log("CONNECTION CLOSE");
        this.dataStore.isConnected = false;
        this._isConnected.next(false);
        await this.auth.logoutUserAsync()
    })

    connection.on("onNewForum", (result:ForumView) => {
      console.log("onNewForum")
      console.log(result)
      this._onNewForum.next(result);
    })

    connection.on("onNewMessage", (result:RegisterMessage) => {
      console.log("onNewMessage")
      console.log(result);
      this._onNewMessage.next(result);
    })

    connection.on("onNewChannel", (result:RegisterChannelResult) => {
      console.log("onNewChannel")
      console.log(result);
      this._onNewCategorie.next(result);
    })

    connection.on("onUserConnect", (idUser:string) => {
      console.log("onUserConnect")
      console.log(idUser);
      this._onUserConnect.next(idUser);
    })

    connection.on("onUserDisconnect", (idUser:string) => {
      console.log("onUserDisconnect")
      console.log(idUser);
      this._onUserDisconnect.next(idUser);
    })

    connection.on("onUserSubscribe", (result:SubscribeResultView) => {
      console.log("onUserSubscribe")
      console.log(result);
      this._onUserSubscribe.next(result);
    })

    connection.on("onDeleteChannel", (result:DeleteChannelForm) => {
      console.log("onDeleteChannel")
      console.log(result)
      this._onChannelDeleted.next(result);
    })

  }

}

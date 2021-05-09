import { Component, Input, OnInit, ViewChild } from '@angular/core';
import UserView from 'src/models/forum/UserView';
import { AccountView } from 'src/models/views/auth/AuthView';
import { WsService } from 'src/services/request/ws.service';
import { UserService } from 'src/services/user/user.service';
import { ModalDirective } from 'angular-bootstrap-md';
import { AuthService } from 'src/services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-userpanel',
  templateUrl: './userpanel.component.html',
  styleUrls: ['./userpanel.component.scss']
})
export class UserpanelComponent implements OnInit {

  identity: AccountView;
  isConnected: boolean;
  user: UserView;
  color: string;

  @ViewChild(ModalDirective) modal: ModalDirective;

  constructor(private userService : UserService, private websocket : WsService, private authService : AuthService) {

  }

  ngOnInit(): void {
    this.userService.myIdentity.subscribe(identity => {
      this.identity = identity;
      console.log("MY IDENITYTYYYYYYYYYYYYYYYYYYYYYY")
      console.log(identity)
    })
    this.websocket.isConnected.subscribe((connect:boolean) => {
      this.isConnected = connect;
      this.color = connect ?  "text-green-900" : "text-red-900";
    })
  }

  async onLogout(){
    await this.authService.logoutUserAsync();
    window.location.reload();
  }

}

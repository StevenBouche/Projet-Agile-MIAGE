import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForumpanelComponent } from './forumpanel.component';
import { ChannelpanelComponent } from './channelpanel/channelpanel.component';
import { UseritemComponent } from './channelpanel/useritem/useritem.component';
import { MessageitemComponent } from './channelpanel/messageitem/messageitem.component';
import { UserpanelModule } from '../userpanel/userpanel.module';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChannelitemComponent } from './channelitem/channelitem.component';


@NgModule({
  declarations: [
    ForumpanelComponent,
    ChannelpanelComponent,
    UseritemComponent,
    MessageitemComponent,
    ChannelitemComponent
  ],
  imports: [
    CommonModule,
    UserpanelModule,
    MDBBootstrapModule.forRoot(),
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    ForumpanelComponent
  ]
})
export class ForumpanelModule { }

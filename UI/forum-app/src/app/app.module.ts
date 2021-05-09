
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//Module MDB
import { MDBBootstrapModule } from 'angular-bootstrap-md';

//Routing and Component App
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

//Forum module
import { ForumModule } from './forum/forum.module';
import { AuthModule } from './forum/auth/auth.module'
import { ToastrModule } from 'ngx-toastr';


@NgModule({
  declarations: [
    AppComponent  
  ],
  imports: [
    AuthModule,
    ForumModule,
    BrowserModule,
    BrowserAnimationsModule,
    MDBBootstrapModule.forRoot(),
    FormsModule,
    AppRoutingModule,
	  ToastrModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { ForumComponent } from './forum.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthHttpInterceptor } from 'src/services/request/AuthHttpInterceptor';
import { MatProgressBarModule } from 'node_modules/@angular/material/progress-bar';
import { CommonModule } from "@angular/common";
import { ForumsearchModule } from './forumsearch/forumsearch.module';
import { ForumpanelModule } from './forumpanel/forumpanel.module';

@NgModule({
  declarations: [
    ForumComponent
  ],
  imports: [
    HttpClientModule,
    MatProgressBarModule,
    CommonModule,
    ForumsearchModule,
    ForumpanelModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor,
      multi: true
    }
  ]
})

export class ForumModule { }

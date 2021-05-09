import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserpanelComponent } from './userpanel.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    UserpanelComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    UserpanelComponent
  ]
})
export class UserpanelModule { }

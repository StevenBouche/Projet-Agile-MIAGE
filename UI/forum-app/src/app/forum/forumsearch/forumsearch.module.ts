import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardsearchComponent } from './boardsearch/boardsearch.component';
import { BoardcreateComponent } from './boardcreate/boardcreate.component';
import { MatTableModule} from '@angular/material/table';
import { ForumsearchComponent } from './forumsearch.component';
import { UserpanelModule } from '../userpanel/userpanel.module';
import { ForumsearchitemComponent } from './boardsearch/forumsearchitem/forumsearchitem.component';
import { MatCardModule } from '@angular/material/card';
import { AngularFileUploaderModule } from "angular-file-uploader";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
  declarations: [
    ForumsearchComponent,
    BoardsearchComponent,
    BoardcreateComponent,
    ForumsearchitemComponent
  ],
  imports: [
    CommonModule,
    MatTableModule,
    UserpanelModule,
    MatCardModule,
    MatPaginatorModule,
    AngularFileUploaderModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    ForumsearchComponent
  ]
})
export class ForumsearchModule { }

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import ForumView from 'src/models/forum/ForumView';
import { ForumService } from 'src/services/forum/forum.service';

@Component({
  selector: 'app-forumsearchitem',
  templateUrl: './forumsearchitem.component.html',
  styleUrls: ['./forumsearchitem.component.scss']
})
export class ForumsearchitemComponent implements OnInit {

  @Input() item: ForumView;

  constructor(private forumService : ForumService) {  }

  ngOnInit(): void {
  }

  async subscribe() {
    console.log("THIS ITEM : ");
    console.log(this.item);
    await this.forumService.subscribeToAForumAsync(this.item);
  }

}

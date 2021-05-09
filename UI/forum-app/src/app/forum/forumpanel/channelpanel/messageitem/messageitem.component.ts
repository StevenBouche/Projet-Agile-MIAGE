
import { Component, Input, OnInit } from '@angular/core';
import MessageView from 'src/models/forum/MessageView';
import UserView from 'src/models/forum/UserView';
import { ForumService } from 'src/services/forum/forum.service';

@Component({
  selector: 'app-messageitem',
  templateUrl: './messageitem.component.html',
  styleUrls: ['./messageitem.component.scss']
})
export class MessageitemComponent implements OnInit {

  @Input() message: MessageView;
  user : UserView;
  date : string;

  constructor(private forumService : ForumService) { }

  ngOnInit(): void {

    //setup string date
    if(this.message != undefined && this.message.timestamp != undefined)
      var date = new Date(this.message.timestamp)
      this.date = date.toLocaleDateString() + " " + date.toTimeString();

    //search user of this message
    this.forumService.usersOfMyForumSelected.subscribe((users : Array<UserView>) => {
      this.user = users.find(user => user.id == this.message.userId);
    })

  }

}

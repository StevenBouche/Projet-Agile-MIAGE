import { Component, Input, OnInit } from '@angular/core';
import UserView from 'src/models/forum/UserView';
import { ForumService } from 'src/services/forum/forum.service';

@Component({
  selector: 'app-useritem',
  templateUrl: './useritem.component.html',
  styleUrls: ['./useritem.component.scss']
})
export class UseritemComponent implements OnInit {

  @Input() user : UserView;

  constructor(private forumService: ForumService) { }

  ngOnInit(): void {

    this.forumService.onEventUserWs.subscribe((user:UserView) => {

      if(user==undefined) return;

      if(this.user?.id==user.id){
        this.user.isConnected = user.isConnected;
      }

    })

  }

}

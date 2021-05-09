import { Component, Input, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import ChannelView from 'src/models/forum/ChannelView';
import ForumPanelView from 'src/models/forum/ForumPanelView';
import ForumView from 'src/models/forum/ForumView';
import RegisterChannel from 'src/models/forum/RegisterChannel';
import UserView from 'src/models/forum/UserView';
import { RegisterView } from 'src/models/views/auth/AuthView';
import { ForumService } from 'src/services/forum/forum.service';

@Component({
  selector: 'app-forumpanel',
  templateUrl: './forumpanel.component.html',
  styleUrls: ['./forumpanel.component.scss']
})

export class ForumpanelComponent implements OnInit {

  forum : ForumView;
  channels : Array<ChannelView>

  idChannelSelect: string;

  displayParamForum: boolean;
  channelName : string;

  constructor(private forumService : ForumService) {
      this.displayParamForum = false;
      this.channelName = '';
   }

  ngOnInit() {

    this.forumService.myForumSelected.subscribe((forum : ForumView) => {
      this.forum = forum;
    })

    this.forumService.channelsOfMyForumSelected.subscribe((channels:Array<ChannelView>) => {
      console.log("CHANNELS SELECTS CHANGE")
      console.log(channels);
      this.channels = channels;
    })

  }

  onClickParamForum(){
    console.log("click on param forum")
    this.displayParamForum=!this.displayParamForum;
  }

  async onNewChannel() {
    this.channelName = this.channelName.trim();
    if(this.channelName === undefined || this.channelName === '') return;
    await this.forumService.createNewChannelForumSelectedAsync(this.channelName);
  }

}

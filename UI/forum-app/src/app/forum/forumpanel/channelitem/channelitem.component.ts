import { Component, Input, OnInit } from '@angular/core';
import ChannelView from 'src/models/forum/ChannelView';
import DeleteChannelForm from 'src/models/forum/DeleteChannelForm';
import { ForumService } from 'src/services/forum/forum.service';

@Component({
  selector: 'app-channelitem',
  templateUrl: './channelitem.component.html',
  styleUrls: ['./channelitem.component.scss']
})
export class ChannelitemComponent implements OnInit {

  @Input() item: ChannelView;
  isActive: boolean;
  class : string;

  constructor(private forumService: ForumService) {
    this.isActive = false;
    this.class = "";
  }

  ngOnInit(): void {
    this.forumService.channelForumSelected.subscribe((channel:ChannelView) => {
      console.log("CHANNEL SELECT")
      console.log(channel)
      this.isActive = channel != undefined && channel.id === this.item.id;
      this.getClass();
    })
  }

  getClass(){
    this.class = this.isActive ?
      "text-gray-500 px-2 hover:text-gray-200 hover:bg-gray-900 bg-gray-600 rounded"
      :"text-gray-500 px-2 hover:text-gray-200 hover:bg-gray-900";
  }

  async onChannelSelect(){
    console.log("ON CHANNEL CHANGE")
    console.log(this.item)
    await this.forumService.selectChannelForumAsync(this.item.id)
  }

  async deleteItem(){
    await this.forumService.deleteAChannelAsync(this.item.id);
  }

}

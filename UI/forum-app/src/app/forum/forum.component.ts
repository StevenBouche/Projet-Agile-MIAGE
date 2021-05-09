import { Component, OnInit } from "@angular/core";
import ForumView from "src/models/forum/ForumView";
import { ForumService } from "src/services/forum/forum.service";
import { WsService } from "src/services/request/ws.service";

@Component({
  selector: "app-forum",
  templateUrl: "./forum.component.html",
  styleUrls: ["./forum.component.scss"],
})
export class ForumComponent implements OnInit {
  forums: Array<ForumView>;
  forumSelected: ForumView;

  component: string;
  componentSearchName: string = "showSearchForum";
  componentForumName: string = "showForumSelect";

  constructor(
    private connectionWs: WsService,
    private forumService: ForumService
  ) {
    this.component = this.componentSearchName;
  }

  async ngOnInit() {
    //subscribe event my forum
    this.forumService.myForums.subscribe((list: Array<ForumView>) => {
      this.forums = list;
      this.component =
        list.length == 0 ? this.componentSearchName : this.componentForumName;
    });
    //subscribe event selected forum
    this.forumService.myForumSelected.subscribe((value: ForumView) => {
      console.log("FORUM SELECTED FORUM COMPONENT");
      console.log(value);
      this.forumSelected = value;
      this.component = this.componentForumName;
    });
    // load my forum
    await this.forumService.loadMyForumsAsync();
    //connect to forum websocket server
    await this.connectionWs.connectToWebSocketAsync();
  }

  ngOnDestroy(): void {
    this.connectionWs.disconnectWebSocket();
  }

  async onSearchForumSelect() {
    await this.forumService.selectMyForumsAsync(undefined);
    this.component = this.componentSearchName;
  }

  async onForumSelect(forum: ForumView) {
    console.log(forum);
    await this.forumService.selectMyForumsAsync(forum._id);
  }

  forumIsSelected(forum: ForumView): boolean {
    return (
      this.forumSelected != undefined &&
      forum != undefined &&
      this.forumSelected._id == forum._id
    );
  }
}

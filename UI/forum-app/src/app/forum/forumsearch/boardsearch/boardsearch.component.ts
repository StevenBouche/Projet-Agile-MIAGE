import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import ForumSearchView from 'src/models/forum/ForumSearchView';
import { ForumService } from 'src/services/forum/forum.service';
import { NotificationService } from 'src/services/notification/notification.service';

@Component({
  selector: 'app-boardsearch',
  templateUrl: './boardsearch.component.html',
  styleUrls: ['./boardsearch.component.scss']
})
export class BoardsearchComponent implements OnInit {

  forumsView : ForumSearchView;

  constructor(private forumService : ForumService, private notif : NotificationService) {

  }

  async ngOnInit() {
    // this.forumsView = await this.forumService.getForums(this.forumsView);
    this.forumService.searchForum.subscribe((data: ForumSearchView) => {
      this.forumsView = data;
      console.log("DATA : ");
      console.log(data);
    })

    await this.forumService.loadSearchForumAsync();
  }

  async onPageChange(event:PageEvent){
    console.log(event)
    await this.forumService.OnSearchPaginitionChangeAsync(event.length,event.pageIndex,event.pageSize);
  }

}

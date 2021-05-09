import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import ForumView from 'src/models/forum/ForumView';

class ActionForum {
  public name: string;
  public route: string;
  public routeBack: string;
}

@Component({
  selector: 'app-forumsearch',
  templateUrl: './forumsearch.component.html',
  styleUrls: ['./forumsearch.component.scss']
})
export class ForumsearchComponent implements OnInit {

  actions: Array<ActionForum>
  currentAction: ActionForum;
  component: string;
  componentSearch: ActionForum;
  componentCreate: ActionForum;
  @Output() onUpdate = new EventEmitter();

  constructor() {
    this.actions = new Array();
    this.componentSearch = new ActionForum();
    this.componentSearch.name = "Search";
    this.componentCreate = new ActionForum();
    this.componentCreate.name = "Create";
    this.actions.push(this.componentSearch);
    this.actions.push(this.componentCreate);
    this.currentAction = this.componentSearch;
  }

  ngOnInit(): void {
    this.component = this.componentSearch.name;
  }

  getChannelClass(action: ActionForum) : string {
    if(this.currentAction.name === action.name) {
      return 'text-gray-200 px-2 hover:text-gray-200 hover:bg-gray-900 bg-gray-600 rounded';
    } else {
      return 'text-gray-500 px-2 hover:text-gray-200 hover:bg-gray-900';
    }
  }

  onActionSelect(action: ActionForum){
    this.currentAction = action;
    this.component = action.name;
  }


}

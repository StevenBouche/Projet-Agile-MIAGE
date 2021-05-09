import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Config } from "src/app/config.module";
import ChannelPanelView from "src/models/forum/ChannelPanelView";
import ChannelView from "src/models/forum/ChannelView";
import DeleteChannelForm from "src/models/forum/DeleteChannelForm";
import ForumForm from "src/models/forum/ForumForm";
import ForumPanelView from "src/models/forum/ForumPanelView";
import ForumSearchView from "src/models/forum/ForumSearchView";
import ForumView from "src/models/forum/ForumView";
import MessageView from "src/models/forum/MessageView";
import RegisterChannel from "src/models/forum/RegisterChannel";
import RegisterChannelResult from "src/models/forum/RegisterChannelResult";
import RegisterMessage from "src/models/forum/RegisterMessage";
import SubscribeResultView from "src/models/forum/SubscribeResultView";
import UserView from "src/models/forum/UserView";
import { AccountView } from "src/models/views/auth/AuthView";
import { NotificationService } from "../notification/notification.service";
import { RequestService } from "../request/RequestService";
import { WsService } from "../request/ws.service";
import { UserService } from "../user/user.service";

class FactoryModel {
  static defaultForumSearchView(): ForumSearchView {
    let search = new ForumSearchView();
    search.currentPage = 1;
    search.descFilter = "";
    search.nameFilter = "";
    search.totalItem = 0;
    search.totalPage = 0;
    search.nbItemPerPage = 10;
    search.totalItemCurent = 0;
    search.forumSearch = new Array<ForumView>();
    return search;
  }
}

@Injectable({
  providedIn: "root",
})
export class ForumService {
  private readonly apiUrl = Config.API_WS + "/Forum";
  private readonly apiUrlChannel = Config.API_WS + "/Channel";
  private readonly apiUrlMsg = Config.API_WS + "/Message";

  private _myForums = new BehaviorSubject<Array<ForumView>>(
    new Array<ForumView>()
  );
  private _searchForum = new BehaviorSubject<ForumSearchView>(
    FactoryModel.defaultForumSearchView()
  );
  //Selector forum - channel
  private _myForumSelected = new BehaviorSubject<ForumView>(undefined);
  private _channelForumSelected = new BehaviorSubject<ChannelView>(undefined);
  //data channels users messages
  private _channelsOfMyForumSelected = new BehaviorSubject<Array<ChannelView>>(
    new Array<ChannelView>()
  );
  private _usersOfMyForumSelected = new BehaviorSubject<Array<UserView>>(
    new Array<UserView>()
  );
  private _messagesOfChannelSelected = new BehaviorSubject<Array<MessageView>>(
    new Array<MessageView>()
  );

  readonly searchForum = this._searchForum.asObservable();
  readonly myForums = this._myForums.asObservable();
  readonly myForumSelected = this._myForumSelected.asObservable();
  readonly channelsOfMyForumSelected = this._channelsOfMyForumSelected.asObservable();
  readonly usersOfMyForumSelected = this._usersOfMyForumSelected.asObservable();
  readonly channelForumSelected = this._channelForumSelected.asObservable();
  readonly messagesOfChannelSelected = this._messagesOfChannelSelected.asObservable();

  private dataStore: {
    myForums: Array<ForumView>;
    searchForum: ForumSearchView;
    myForumSelected: ForumView;
    channelsOfMyForumSelected: Array<ChannelView>;
    usersOfMyForumSelected: Array<UserView>;
    channelForumSelected: ChannelView;
    messagesOfChannelSelected: Array<MessageView>;
  } = {
    myForums: new Array<ForumView>(),
    searchForum: FactoryModel.defaultForumSearchView(),
    myForumSelected: undefined,
    channelsOfMyForumSelected: Array<ChannelView>(),
    usersOfMyForumSelected: new Array<UserView>(),
    channelForumSelected: undefined,
    messagesOfChannelSelected: new Array<MessageView>(),
  }; // store our data in memory

  private identity: AccountView;

  private _onEventUserWs = new BehaviorSubject<UserView>(undefined);

  readonly onEventUserWs = this._onEventUserWs.asObservable();

  constructor(
    private req: RequestService,
    private notif: NotificationService,
    private websocket: WsService,
    private userService: UserService
  ) {
    this.userService.myIdentity.subscribe((identity: AccountView) => {
      this.identity = identity;
    });

    this.websocket.onNewForum.subscribe(async (forum) => {
      if (forum == undefined) return;

      await this.loadSearchForumAsync();
    });

    this.websocket.onNewMessage.subscribe((message: RegisterMessage) => {
      if (message == undefined) return;

      if (message.messageV.userId == this.identity?._id) return;

      if (this.dataStore.myForumSelected._id !== message.idForum) return;

      if (this.dataStore.channelForumSelected.id !== message.idChannel) return;

      this.pushMessageStore(message.messageV);

      this.notif.showSuccess("new message on channel", "Message");
    });

    this.websocket.onNewCategorie.subscribe(
      (channel: RegisterChannelResult) => {
        if (channel == undefined) return;

        if (channel.userId == this.identity?._id) return;

        if (this.dataStore.myForumSelected._id !== channel.forum._id) return;

        this.addNewChannelStore(Object.assign({}, channel.channel));
      }
    );

    this.websocket.onUserConnect.subscribe((idUser: string) => {
      if (idUser == undefined) return;

      let user2 = this.dataStore.usersOfMyForumSelected.find(
        (user) => user.id === idUser
      );

      if (user2 == undefined) return;

      user2.isConnected = true;

      //this._onEventUserWs.next(user2);
      this.setUserStore(this.dataStore.usersOfMyForumSelected);
      //this._usersOfMyForumSelected.next(this.cpObj(this.dataStore).usersOfMyForumSelected);
    });

    this.websocket.onUserDisconnect.subscribe((idUser: string) => {
      if (idUser == undefined) return;

      let user2 = this.dataStore.usersOfMyForumSelected.find(
        (user) => user.id === idUser
      );

      if (user2 == undefined) return;

      user2.isConnected = false;

      //this._onEventUserWs.next(user2);

      this.setUserStore(this.dataStore.usersOfMyForumSelected);

      //this._usersOfMyForumSelected.next(this.cpObj(this.dataStore).usersOfMyForumSelected);
    });

    this.websocket.onUserSubscribe.subscribe((sub: SubscribeResultView) => {
      if (sub == undefined) return;

      //if my sub ignore
      if (sub.user.id == this.identity?._id) return;

      //if not my current forum
      if (
        this.dataStore.myForumSelected != undefined &&
        this.dataStore.myForumSelected._id !== sub.idForum
      )
        return;

      //and user is defined
      if (sub.user === undefined) return;

      this.addUserStore(sub.user);
    });

    this.websocket.onChannelDeleted.subscribe(
      async (delC: DeleteChannelForm) => {
        //verif if deleted
        if (delC?.idForum == undefined || delC?.idChannel == undefined) return;

        //verif is my current forum ?
        if (this.dataStore.myForumSelected?._id !== delC.idForum) return;

        //delete
        let res = this.dataStore.channelsOfMyForumSelected.filter(
          (channel) => channel.id !== delC.idChannel
        );

        //if channel deleted is my current channel
        if (this.dataStore.channelForumSelected?.id === delC.idChannel) {
          //try setup first
          if (res.length > 0 && res !== undefined) {
            await this.selectChannelForumAsync(res[0].id);
          } else await this.selectChannelForumAsync(undefined);
        }

        this.setChannelsMyForumStore(res);
        this.notif.showSuccess("Channel successfuly deleted", "Success");
      }
    );
  }

  /*
   *
   * ACCESSEUR
   */

  setChannelsMyForumStore(result: Array<ChannelView>) {
    this.dataStore.channelsOfMyForumSelected = result;
    this._channelsOfMyForumSelected.next(
      this.cpObj(this.dataStore).channelsOfMyForumSelected
    );
  }

  pushMessageStore(msg: MessageView) {
    //push and notify new message
    this.dataStore.messagesOfChannelSelected.push(msg);
    this._messagesOfChannelSelected.next(
      this.cpObj(this.dataStore).messagesOfChannelSelected
    );
  }

  addNewChannelStore(channel: ChannelView) {
    this.dataStore.channelsOfMyForumSelected.push(channel);
    this._channelsOfMyForumSelected.next(
      this.cpObj(this.dataStore).channelsOfMyForumSelected
    );
  }

  setSearchFormStore(result: ForumSearchView) {
    this.dataStore.searchForum = result;
    this._searchForum.next(this.cpObj(this.dataStore).searchForum);
  }

  setUserStore(results: Array<UserView>) {
    this.dataStore.usersOfMyForumSelected = results;
    this._usersOfMyForumSelected.next(
      this.cpObj(this.dataStore).usersOfMyForumSelected
    );
  }

  addUserStore(user: UserView) {
    this.dataStore.usersOfMyForumSelected.push(user);
    this._usersOfMyForumSelected.next(
      this.cpObj(this.dataStore).usersOfMyForumSelected
    );
  }

  //
  //  LOADING
  //

  async loadMyForumsAsync() {
    //get forum API
    this.dataStore.myForums = await this.getMyForumsAsync();
    //notify change value
    this._myForums.next(Object.assign({}, this.dataStore).myForums);
    //if value have forums and not have current selected forum, set first element of array and notify
    if (
      this.dataStore.myForumSelected == undefined &&
      this.dataStore.myForums.length > 0
    ) {
      await this.selectMyForumsAsync(this.dataStore.myForums[0]._id);
    }
  }

  async loadSearchForumAsync() {
    //execute request
    var result = await this.getForumsAsync(this.dataStore.searchForum);
    this.setSearchFormStore(result);
    //notify change
    this._searchForum.next(this.cpObj(this.dataStore).searchForum);
  }

  private async loadDatasOfSelectedForumAsync() {
    //get forum selected, if is undefined set channel forum to undefined
    var idForum = this.dataStore.myForumSelected?._id;
    if (idForum == undefined) {
      await this.selectChannelForumAsync(undefined);
      return;
    }

    //get panel of selected forum
    var panel = await this.getForumPannelAsync(idForum);

    //set data in store and notify channels / users
    this.setChannelsMyForumStore(panel.channels);
    this.setUserStore(panel.users);

    //si pas de channel selectionner
    if (this.dataStore.channelForumSelected == undefined) {
      //mais il y a des channels alors set le premier channel
      if (panel.channels.length > 0)
        await this.selectChannelForumAsync(panel.channels[0].id);
      return;
    }

    // si channel select
    //find if channel current is in current forum
    this.dataStore.channelForumSelected = panel.channels.find(
      (channel) => channel.id == this.dataStore.channelForumSelected.id
    );
    //is il y est pas et que channels existe alors set le premier sinon set undefined
    if (
      this.dataStore.channelForumSelected == undefined &&
      panel.channels.length > 0
    )
      await this.selectChannelForumAsync(panel.channels[0].id);
    else await this.selectChannelForumAsync(undefined);
  }

  private async loadDataOfSelectedChannelAsync() {
    //if undefined reset messages
    var idChannel = this.dataStore.channelForumSelected?.id;

    if (idChannel == undefined) {
      //else clear the message array
      this.dataStore.messagesOfChannelSelected = new Array<MessageView>();
      this._messagesOfChannelSelected.next(
        this.cpObj(this.dataStore).messagesOfChannelSelected
      );
      return;
    }

    //get panel of selected forum
    var panel = await this.getChannelPannelAsync(idChannel);
    //set data in store and notify message
    this.dataStore.messagesOfChannelSelected = panel.messages;
    this._messagesOfChannelSelected.next(
      this.cpObj(this.dataStore).messagesOfChannelSelected
    );
  }

  //
  //  ACTIONS
  //

  async selectMyForumsAsync(id: string) {
    console.log("select MY FORRRRRRRRRRRRRRRRU");
    //if select undefined, set data to undefined and load refresh dependencie child
    if (id == undefined) {
      this.dataStore.myForumSelected = undefined;
      this._myForumSelected.next(this.cpObj(this.dataStore).myForumSelected);
      await this.loadDatasOfSelectedForumAsync();
      return;
    }

    // else find forum with id
    var selected = this.dataStore.myForums.find((forum) => forum._id == id);

    if (selected == undefined) return;

    //update selected and next
    this.dataStore.myForumSelected = selected;
    this._myForumSelected.next(this.cpObj(this.dataStore).myForumSelected);

    //load data of forum select
    await this.loadDatasOfSelectedForumAsync();
  }

  async selectChannelForumAsync(idChannel: string) {
    //if set channel to undefined reset child field
    if (idChannel == undefined) {
      this.dataStore.channelForumSelected = undefined;
      this._channelForumSelected.next(
        this.cpObj(this.dataStore).channelForumSelected
      );
      await this.loadDataOfSelectedChannelAsync();
      return;
    }

    //else search if exist and set and refresh
    var channelSelect = this.dataStore.channelsOfMyForumSelected.find(
      (channel) => channel.id === idChannel
    );

    if (channelSelect == undefined) return;

    this.dataStore.channelForumSelected = channelSelect;
    this._channelForumSelected.next(
      this.cpObj(this.dataStore).channelForumSelected
    );

    await this.loadDataOfSelectedChannelAsync();
  }

  async createNewChannelForumSelectedAsync(channelName: string) {
    //setup register form
    let register: RegisterChannel = new RegisterChannel();
    register.IdForum = this.dataStore.myForumSelected._id;
    register.NameChannel = channelName;

    //execute request
    var res = await this.newChannelAsync(register);

    //concat result to channels and notify
    this.dataStore.channelsOfMyForumSelected = [
      ...this.dataStore.channelsOfMyForumSelected,
      res.channel,
    ];
    this._channelsOfMyForumSelected.next(
      this.cpObj(this.dataStore).channelsOfMyForumSelected
    );

    //if empty channel select and channels have data, select first channel
    if (
      this.dataStore.channelForumSelected == undefined &&
      this.dataStore.channelsOfMyForumSelected.length > 0
    )
      await this.selectChannelForumAsync(
        this.dataStore.channelsOfMyForumSelected[0].id
      );
  }

  async createNewForumAsync(forum: ForumForm) {
    console.log("CREATTTTTTTE FORUM");
    //execute request to create forum
    var res = await this.sendFormValuesAsync(forum);

    //set redirection on new forum
    //if(this.dataStore.channelForumSelected !== undefined)
    //  this.dataStore.channelForumSelected.id = res._id;

    //refresh my forums to load refresh
    await this.loadMyForumsAsync();

    //execute select of new forum
    await this.selectMyForumsAsync(res._id);
  }

  async subscribeToAForumAsync(forum: ForumView) {
    //error already subscribe
    if (this.dataStore.myForums.find((f) => f._id == forum._id)) {
      this.notif.showError(
        "You have already subscribed to this forum",
        "Error"
      );
      return;
    }

    //execute request
    var res = await this.subscribeAsync(forum._id);

    if (res.result) {
      //and load refresh of my forum
      await this.loadMyForumsAsync();
      await this.selectMyForumsAsync(res.idForum);
      this.notif.showSuccess(res.message, "Success");
    } else {
      this.notif.showError(res.message, "Error");
    }
  }

  async OnSearchPaginitionChangeAsync(
    length: number,
    pageIndex: number,
    pageSize: number
  ) {
    //todo
    this.dataStore.searchForum.totalItem = length;
    this.dataStore.searchForum.currentPage = pageIndex;
    this.dataStore.searchForum.nbItemPerPage = pageSize;
    //this.loadSearchForum();
  }

  async sendMessageAsync(msg: string) {
    //create message view
    let message: MessageView = new MessageView();
    message.timestamp = Date.now();
    message.value = msg;

    //create form
    let registerMsg: RegisterMessage = new RegisterMessage();
    registerMsg.idChannel = this.dataStore.channelForumSelected.id;
    registerMsg.idForum = this.dataStore.myForumSelected._id;
    registerMsg.messageV = message;

    //execute request
    let res = await this.newMsgAsync(registerMsg);

    //if correct response create message (have id)
    // and is current forum and channel
    if (
      res.messageV !== undefined &&
      res.messageV.id !== undefined &&
      res.idForum == this.dataStore.myForumSelected._id &&
      res.idChannel == this.dataStore.channelForumSelected.id
    ) {
      //push message in current list of message
      this.dataStore.messagesOfChannelSelected.push(res.messageV);
      this._messagesOfChannelSelected.next(
        this.cpObj(this.dataStore).messagesOfChannelSelected
      );
    }
  }

  async deleteAChannelAsync(item: string) {
    let res: DeleteChannelForm = new DeleteChannelForm();
    res.idChannel = item;
    res.idUser = this.identity?._id;
    res.idForum = this.dataStore.myForumSelected._id;
    await this.deleteChannelAsync(res);
  }

  //
  // HTTP CALLS
  //

  public async newMsgAsync(registerMsg: RegisterMessage) {
    return await this.req.executePost<RegisterMessage, RegisterMessage>(
      this.apiUrlMsg,
      registerMsg
    );
  }

  public async getForumsAsync(
    listForum: ForumSearchView
  ): Promise<ForumSearchView> {
    return await this.req.executePost<ForumSearchView, ForumSearchView>(
      this.apiUrl + "/searchForum",
      listForum
    );
  }

  public async sendFormValuesAsync(forumForm: ForumForm) {
    return await this.req.executePost<ForumForm, ForumView>(
      this.apiUrl + "/createForum",
      forumForm
    );
  }

  public async getMyForumsAsync(): Promise<Array<ForumView>> {
    return await this.req.executeGet<Array<ForumView>>(
      this.apiUrl + "/myforum"
    );
  }

  public async subscribeAsync(id: string): Promise<SubscribeResultView> {
    return await this.req.executeGet<SubscribeResultView>(
      this.apiUrl + "/subscribe/" + id
    );
  }

  public async newChannelAsync(
    channel: RegisterChannel
  ): Promise<RegisterChannelResult> {
    return await this.req.executePost<RegisterChannel, RegisterChannelResult>(
      this.apiUrlChannel + "/create",
      channel
    );
  }

  public async getForumPannelAsync(idForum: string): Promise<ForumPanelView> {
    return await this.req.executeGet<ForumPanelView>(
      this.apiUrl + "/panel/" + idForum
    );
  }

  public async getChannelPannelAsync(
    idChannel: string
  ): Promise<ChannelPanelView> {
    return await this.req.executeGet<ChannelPanelView>(
      this.apiUrlChannel + "/panel/" + idChannel
    );
  }

  public async deleteChannelAsync(
    deletedChannel: DeleteChannelForm
  ): Promise<DeleteChannelForm> {
    console.log("DELETEEEEEEEEEEE");
    console.log(deletedChannel);
    return await this.req.executePost<DeleteChannelForm, DeleteChannelForm>(
      this.apiUrlChannel + "/delete/",
      deletedChannel
    );
  }

  private cpObj<T>(obj: T): T {
    return Object.assign({}, obj);
  }
}

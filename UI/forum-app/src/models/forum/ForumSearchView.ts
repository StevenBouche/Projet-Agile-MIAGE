import ForumView from "./ForumView";

export default class ForumSearchView {
  public totalItemCurent:number;
  public totalItem: number;
  public totalPage: number;
  public currentPage: number;
  public nbItemPerPage: number;
  public nameFilter: string;
  public descFilter: string;
  public forumSearch: Array<ForumView>;
}

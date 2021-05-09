import ChannelView from './ChannelView';
import ForumView from './ForumView';
import UserView from './UserView';

export default class ForumPanelView {
  public forum : ForumView
  public channels : Array<ChannelView>
  public users : Array<UserView>
}

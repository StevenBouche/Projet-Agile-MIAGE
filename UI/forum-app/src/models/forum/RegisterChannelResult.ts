import ChannelView from './ChannelView';
import ForumView from './ForumView';

export default class RegisterChannelResult {

  public message : string;
  public forum : ForumView;
  public channel : ChannelView;
  public userId : string;

}

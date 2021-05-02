using Authentification;
using ForumServices.Models;
using ForumServices.Models.Form;
using ForumServices.Models.View;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ForumsService.Services
{

    public interface IChannelManagerView
    {
        ChannelView GetChannelView();
        RegisterChannelResult CreateChannelView(RegisterChannel channel, UserIdentity identity);
        ChannelPanelView GetChannelPanelView(string idChannel, UserIdentity identity);
        DeleteChannelForm DeleteChannel(DeleteChannelForm channel, UserIdentity identity);
    }

    public interface IChannelManager
    {
        List<Channel> GetChannelsForum(string idForum, UserIdentity identity);
        Channel GetChannelForum(string idForum, string idChannel, UserIdentity identity);
        Channel CreateChannel(string idForum, Channel c, UserIdentity identity);
        Message AddNewMessageChannel(string idforum, string idchannel, Message messageV, UserIdentity identity);
    }

    public class ChannelsManager : IChannelManagerView, IChannelManager
    {

        private readonly IForumManager Manager;

        public ChannelsManager(IForumManager forumManager)
        {
            this.Manager = forumManager;
        }

        public Message AddNewMessageChannel(string idforum, string idchannel, Message messageV, UserIdentity identity)
        {
            return this.Manager.CreateAndAddNewMessage(idforum, idchannel, messageV, identity);
        }

        public Channel CreateChannel(string idForum, Channel c, UserIdentity identity)
        {
            var channel = new Channel
            {
                Name = c.Name,
                Messages = new List<Message>()
            };

            //todo verif if is subscript to forum
            this.Manager.AddChannelForum(idForum, channel, identity);

            return channel;
        }

        public RegisterChannelResult CreateChannelView(RegisterChannel channel, UserIdentity identity)
        {
            RegisterChannelResult result = new RegisterChannelResult();
            Channel c = this.CreateChannel(channel.IdForum, new Channel { Name = channel.NameChannel }, identity);

            result.Channel = c?.ToChannelView();
            result.Forum = this.Manager.GetForumById(channel.IdForum).ToViewForum();
            result.UserId = identity.ID;

            return result;
        }

        public DeleteChannelForm DeleteChannel(DeleteChannelForm channel, UserIdentity identity)
        {
            bool result = this.Manager.RemoveChannelForum(channel.idForum, channel.idChannel, identity);
            if (result)
            {
                return channel;
            }
            else
            {
                return new DeleteChannelForm();
            }
        }

        public Channel GetChannelForum(string idForum, string idChannel, UserIdentity identity)
        {
            var forum = this.Manager.GetForumById(idForum);
            return forum.Channels.FirstOrDefault(channel => channel.Id == idChannel);
        }

        public ChannelPanelView GetChannelPanelView(string idChannel, UserIdentity identity)
        {
            var panel = new ChannelPanelView();

            this.Manager.GetForumAndChannel(idChannel, out ForumObj forum, out Channel channel, identity);

            if (forum == null || channel == null) return panel;

            panel.Channel = channel.ToChannelView();
            panel.Messages = channel.Messages.Select(message => message.ToMessageView()).ToList();

            return panel;
        }

        public List<Channel> GetChannelsForum(string idForum, UserIdentity identity)
        {
            var forum = this.Manager.GetForumById(idForum);
            if (forum == null) return new List<Channel>();
            return forum.Channels;
        }

        public ChannelView GetChannelView()
        {
            throw new NotImplementedException();
        }
    }
}

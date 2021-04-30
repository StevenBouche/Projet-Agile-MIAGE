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

        public ChannelsManager(IForumManager manager)
        {
            this.Manager = manager;
        }

        public Message AddNewMessageChannel(string idforum, string idchannel, Message messageV, UserIdentity identity)
        {
            throw new NotImplementedException();
        }

        public Channel CreateChannel(string idForum, Channel c, UserIdentity identity)
        {
            throw new NotImplementedException();
        }

        public RegisterChannelResult CreateChannelView(RegisterChannel channel, UserIdentity identity)
        {
            throw new NotImplementedException();
        }

        public DeleteChannelForm DeleteChannel(DeleteChannelForm channel, UserIdentity identity)
        {
            throw new NotImplementedException();
        }

        public Channel GetChannelForum(string idForum, string idChannel, UserIdentity identity)
        {
            throw new NotImplementedException();
        }

        public ChannelPanelView GetChannelPanelView(string idChannel, UserIdentity identity)
        {
            throw new NotImplementedException();
        }

        public List<Channel> GetChannelsForum(string idForum, UserIdentity identity)
        {
            throw new NotImplementedException();
        }

        public ChannelView GetChannelView()
        {
            throw new NotImplementedException();
        }
    }
}

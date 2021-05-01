using Authentification;
using ForumServices.Models;
using ForumServices.Models.View;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ForumsService.Services
{

    public interface IMessageManagerView
    {
        RegisterMessage CreateMessage(RegisterMessage message, UserIdentity identity);
    }

    public interface IMessageManager
    {
  
    }

    public class MessageManager : IMessageManager, IMessageManagerView
    {

        IChannelManager Manager;

        public MessageManager(IChannelManager channelManager)
        {
            this.Manager = channelManager;
        }

        public RegisterMessage CreateMessage(RegisterMessage message, UserIdentity identity)
        {
            Message messageObj = new Message
            {
                Value = message.MessageV.Value,
                Timestamp = message.MessageV.Timestamp,
                UserId = identity.ID
            };

            Message messview = this.Manager.AddNewMessageChannel(message.Idforum, message.Idchannel, messageObj, identity);
            message.MessageV = messview.ToMessageView();
            return message;
        }

    }

}

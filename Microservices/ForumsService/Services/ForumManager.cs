using Authentification;
using ForumServices.Models;
using ForumServices.Models.View;
using IpConfig;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDBAccess;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ForumsService.Services
{
    public interface IForumManager
    {
        ForumObj GetForumById(string id);
        void AddChannelForum(string idForum, Channel channel, UserIdentity identity);
        void GetForumAndChannel(string idChannel, out ForumObj forum, out Channel channel, UserIdentity user);
        Message CreateAndAddNewMessage(string idforum, string idchannel, Message message, UserIdentity identity);
        bool RemoveChannelForum(string idForum, string idChannel, UserIdentity identity);
    }

    public interface IForumManagerView
    {
        ForumView CreateForum(ForumForm value, UserIdentity iD);
        ForumSearchView SearchForums(ForumSearchView search, UserIdentity iD);
        SubscribeResultView UserSubscribe(string idForum, UserIdentity iD);
        List<ForumView> GetForumsOfUser(UserIdentity identity);
        ForumPanelView GetForumPanel(string id, UserIdentity identity);
    }

    public class ForumManager : IForumManager, IForumManagerView
    {
        private readonly IMongoDBContext<ForumObj> Context;
        private readonly CacheUserWs Cache;

        public static readonly object LockObject = new object();

        public ForumManager(IMongoDBContext<ForumObj> c, CacheUserWs cache)
        {
            this.Context = c;
            this.Cache = cache;
        }

        public ForumObj GetForumById(string id)
        {
            throw new NotImplementedException();
        }

        public void AddChannelForum(string idForum, Channel channel, UserIdentity identity)
        {
            throw new NotImplementedException();
        }

        public void GetForumAndChannel(string idChannel, out ForumObj forum, out Channel channel, UserIdentity user)
        {
            throw new NotImplementedException();
        }

        public Message CreateAndAddNewMessage(string idforum, string idchannel, Message message, UserIdentity identity)
        {
            throw new NotImplementedException();
        }

        public bool RemoveChannelForum(string idForum, string idChannel, UserIdentity identity)
        {
            throw new NotImplementedException();
        }

        public ForumView CreateForum(ForumForm value, UserIdentity iD)
        {
            throw new NotImplementedException();
        }

        public ForumSearchView SearchForums(ForumSearchView search, UserIdentity iD)
        {
            throw new NotImplementedException();
        }

        public SubscribeResultView UserSubscribe(string idForum, UserIdentity iD)
        {
            throw new NotImplementedException();
        }

        public List<ForumView> GetForumsOfUser(UserIdentity identity)
        {
            throw new NotImplementedException();
        }

        public ForumPanelView GetForumPanel(string id, UserIdentity identity)
        {
            throw new NotImplementedException();
        }
    }
}

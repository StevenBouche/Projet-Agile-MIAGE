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
            return this.Context.GetQueryable().FirstOrDefault(forum => forum.Id.Equals(id));
        }

        public void AddChannelForum(string idForum, Channel channel, UserIdentity identity)
        {
            ForumObj forum = this.GetForumById(idForum);

            if ( forum == null )
            {
                return;
            }

            if ( forum.Users.Any(User => User.Id == identity.ID))
            {
                lock(LockObject)
                {
                    channel.Id = ObjectId.GenerateNewId().ToString();
                    forum.Channels.Add(channel);
                    this.Context.GetCollection().ReplaceOne(acc => acc.Id.Equals(forum.Id), forum);
                }
            }
        }

        public void GetForumAndChannel(string idChannel, out ForumObj forum, out Channel channel, UserIdentity identity)
        {
            forum = null;
            channel = null;

            ForumObj resForum = this.Context.GetQueryable().FirstOrDefault(forum => forum.Channels.Where(channel => channel.Id == idChannel).Any());

            if (resForum != null)
            {
                if(resForum.Users.Any(user => user.Id == identity.ID))
                {
                    forum = resForum;
                    channel = resForum.Channels.FirstOrDefault(channel => channel.Id == idChannel);
                }
            }
        }

        public Message CreateAndAddNewMessage(string idforum, string idchannel, Message message, UserIdentity identity)
        {
            bool permit = this.Context.GetQueryable()
                .Any(Forum =>
                        Forum.Id == idforum &&
                        Forum.Users.Any(user => user.Id == identity.ID) &&
                        Forum.Channels.Any(channel => channel.Id == idchannel));

            if (permit && message.UserId == identity.ID)
            {
                lock (LockObject)
                {
                    message.Id = ObjectId.GenerateNewId().ToString();

                    ForumObj forum = this.Context.GetQueryable().FirstOrDefault(f => f.Id == idforum && f.Channels.Any(channel => channel.Id == idchannel));

                    forum.Channels.FirstOrDefault(channel => channel.Id == idchannel).Messages.Add(message);

                    this.Context.GetCollection().ReplaceOne(f => f.Id == forum.Id, forum);

                    return forum.Channels.FirstOrDefault(Channel => Channel.Id == idchannel).Messages.FirstOrDefault(m => m.Id == message.Id);

                }

            }

            return message;
        }

        public bool RemoveChannelForum(string idForum, string idChannel, UserIdentity identity)
        {
            bool permit = this.Context.GetQueryable()
                .Any(Forum =>
                        Forum.Id == idForum &&
                        Forum.Users.Any(user => user.Id == identity.ID) &&
                        Forum.Channels.Any(channel => channel.Id == idChannel));

            if (permit)
            {
                lock (LockObject)
                {
                    ForumObj forum = this.Context.GetQueryable().FirstOrDefault(f => f.Id == idForum && f.Channels.Any(channel => channel.Id == idChannel));

                    forum.Channels.RemoveAll(channel => channel.Id == idChannel);

                    this.Context.GetCollection().ReplaceOne(f => f.Id == forum.Id, forum);

                    var test = this.Context.GetQueryable()
                    .Any(Forum =>
                            Forum.Id == idForum &&
                            Forum.Users.Any(user => user.Id == identity.ID) &&
                            Forum.Channels.Any(channel => channel.Id == idChannel));

                    return permit == true && test == false;
                }
                
            }

            return false;
        }

        public ForumView CreateForum(ForumForm value, UserIdentity identity)
        {
            var forum = new ForumObj
            {
                Id = ObjectId.GenerateNewId().ToString(),
                Name = value.Name,
                UrlPicture = value.Image,
                Description = value.Description,
                Channels = new List<Channel>(),
                Users = new List<User>()
            };

            lock ( LockObject )
            {
                forum.Users.Add(new User
                {
                    Id = identity.ID,
                    Pseudo = identity.Pseudo,
                    UrlPicture = Config.URL + "/account/picture/" + identity.ID
                });

                this.Context.GetCollection().InsertOne(forum);
            }

            if (forum.Id != null)
            {
                return this.GetForumById(forum.Id).ToViewForum();
            }

            return forum.ToViewForum();

        }

        public ForumSearchView SearchForums(ForumSearchView search, UserIdentity iD)
        {
            if(this.Context.GetQueryable().Count() >= 0)
            {

                List<ForumObj> forums = this.Context.GetQueryable().ToList();

                forums.ForEach(forum =>
                {
                    forum.Users.ForEach(user =>
                    {
                        user.IsConnected = this.Cache.usersIdWebSocket.Values.Contains(user.Id);
                    });
                });

                search.ForumSearch = forums.Select(element => new ForumView
                {
                    Id = element.Id,
                    Name = element.Name,
                    Description = element.Description,
                    UrlPicture = element.UrlPicture,
                    NbMember = element.Users.Count,
                    NbOnline = element.Users.Where(user => user.IsConnected).Count()
                }).ToList();

                search.TotalItem = forums.Count;
                
            }

            return search;
        }

        public SubscribeResultView UserSubscribe(string idForum, UserIdentity identity)
        {
            SubscribeResultView sub = new SubscribeResultView();
            sub.Result = false;

            if (String.IsNullOrEmpty(idForum))
            {          
                sub.Message = "id forum missing";
                return sub;
            }

            if (String.IsNullOrEmpty(identity.ID))
            {
                sub.Message = "id user missing";
                return sub;
            }

            lock (LockObject)
            {
                ForumObj forum = this.GetForumById(idForum);

                if (forum == null)
                {
                    sub.Message = "forum not found";
                    return sub;
                }

                if (forum.Users.Any(User => User.Id == identity.ID))
                {
                    sub.Message = "user is already subscribe";
                    return sub;
                }

                User u = new User
                {
                    Id = identity.ID,
                    Pseudo = identity.Pseudo,
                    UrlPicture = identity.UrlPicture
                };

                forum.Users.Add(u);

                this.Context.GetCollection().ReplaceOne((f => f.Id == forum.Id), forum);

                sub.Result = true;
                sub.IdForum = idForum;
                sub.Message = "succes";
                sub.User = u.ToUserView();
                sub.User.IsConnected = this.Cache.usersIdWebSocket.Values.Contains(sub.User.Id);
            }

            return sub;

        }

        public List<ForumView> GetForumsOfUser(UserIdentity identity)
        {
            return this.Context.GetQueryable()
                .Where(forum => forum.Users.Where(user => user.Id == identity.ID).Any())
                .ToList()
                .Select(forum => forum.ToViewForum())
                .ToList();
        }

        public ForumPanelView GetForumPanel(string id, UserIdentity identity)
        {
            ForumObj forum = this.GetForumById(id);

            ForumPanelView panel = new ForumPanelView();

            if (forum == null) return panel;

            panel.Forum = forum.ToViewForum();
            panel.Channels = forum.Channels.Select(channel => channel.ToChannelView()).ToList();
            panel.Users = forum.Users.Select(user => user.ToUserView()).ToList();

            return panel;
        }
    }
}

using Authentification;
using ForumServices.Models.View;
using ForumsService.Services;
using ForumsService.SignalR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ForumsService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ForumController : ControllerBase
    {

        IForumManagerView Manager;
        private readonly IHubContext<ForumHub> Context;
        CacheUserWs Cache;

        private UserIdentity Identity
        {
            get
            {
                return this.User is null ? null : new UserIdentity(this.User);
            }
        }

        public ForumController(IForumManagerView forumManager, IHubContext<ForumHub> hubContext, CacheUserWs cache)
        {
            this.Manager = forumManager;
            this.Context = hubContext;
            this.Cache = cache;
        }

        [HttpGet("myforum")]
        public ActionResult<List<ForumView>> GetMyForum()
        {
            List<ForumView> forums = this.Manager.GetForumsOfUser(this.Identity);
            return this.Ok(forums);
        }

        [HttpPost("createForum")]
        public async Task<ActionResult<ForumView>> CreateForum([FromBody] ForumForm value)
        {
            ForumView forum = this.Manager.CreateForum(value,this.Identity);
            await this.Context.Clients.AllExcept(new string[] { Identity.ID }).SendAsync("onNewForum", forum);
            return this.Ok(forum);
        }

        [HttpPost("searchForum")]
        public ActionResult<ForumSearchView> SearchForums([FromBody] ForumSearchView search)
        {
            ForumSearchView searchResult = this.Manager.SearchForums(search, this.Identity);
            return this.Ok(searchResult);
        }

        [HttpGet("subscribe/{id}")]
        public ActionResult<SubscribeResultView> SubForum(string id)
        {
            SubscribeResultView result = this.Manager.UserSubscribe(id, this.Identity);
            if (result.Result)
            {
                this.Context.Clients.AllExcept(new string[] { this.Identity.ID }).SendAsync("onUserSubscribe", result);
            }
            return this.Ok(result);
        }

        [HttpGet("panel/{id}")]
        public ActionResult<string> GetForumPanel(string id)
        {
            ForumPanelView result = this.Manager.GetForumPanel(id, this.Identity);
            result.Users.ForEach(user =>
            {
                user.IsConnected = this.Cache.usersIdWebSocket.Values.Contains(user.Id);
            });
            return this.Ok(result);
        }

    }
}

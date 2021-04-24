using Authentification;
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
        private readonly IHubContext<ForumHub> HubContext;
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
            this.HubContext = hubContext;
            this.Cache = cache;
        }



    }
}

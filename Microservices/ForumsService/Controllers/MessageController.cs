using System.Threading.Tasks;
using Authentification;
using ForumServices.Models.View;
using ForumsService.Services;
using ForumsService.SignalR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace ForumsService.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    [Authorize]
    public class MessageController : ControllerBase
    {

        IMessageManagerView Manager;
        private readonly IHubContext<ForumHub> HubContext;

        private UserIdentity Identity
        {
            get
            {
                return this.User is null ? null : new UserIdentity(this.User);
            }
        }

        public MessageController(IMessageManagerView forumManager, IHubContext<ForumHub> hubContext)
        {
            this.Manager = forumManager;
            this.HubContext = hubContext;
        }

        [HttpPost]
        public async Task<ActionResult<RegisterMessage>> CreateMessage([FromBody] RegisterMessage message)
        {
            RegisterMessage result = this.Manager.CreateMessage(message, this.Identity);
            await this.HubContext.Clients.AllExcept(new string[] { this.Identity.ID }).SendAsync("onNewMessage",result);
            return this.Ok(result);
        }
    }
}

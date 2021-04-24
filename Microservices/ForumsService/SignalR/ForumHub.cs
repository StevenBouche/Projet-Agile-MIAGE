using ForumsService.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;

namespace ForumsService.SignalR
{

    [Authorize(AuthenticationSchemes = "Bearer")]
    public class ForumHub : Hub
    {
        CacheUserWs Cache;

        public ForumHub(CacheUserWs cache)
        {
            this.Cache = cache;
        }

        public override async Task OnConnectedAsync()
        {
            Console.WriteLine("Connected");
            var userId = this.GetIdUser();
            await base.OnConnectedAsync();
            this.Cache.UserConnect(userId, GetIdWsUser());
            await Clients.AllExcept(new string[] { userId }).SendAsync("onUserConnect", userId);
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            Console.WriteLine("Disconnect");
            var userId = this.GetIdUser();
            await base.OnDisconnectedAsync(exception);
            this.Cache.UserDisconnect(userId, GetIdWsUser());
            await Clients.AllExcept(new string[] { userId }).SendAsync("onUserDisconnect", userId);
        }

        public string GetIdUser()
        {
            return this.Context.UserIdentifier;
        }

        public string GetIdWsUser()
        {
            return this.Context.ConnectionId;
        }

    }
}

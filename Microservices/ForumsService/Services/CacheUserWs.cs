using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace ForumsService.Services
{
 
    public class CacheUserWs
    {
        public readonly ConcurrentDictionary<string,string> usersIdWebSocket;

        public CacheUserWs()
        {
            this.usersIdWebSocket = new ConcurrentDictionary<string, string>();
        }

        public void UserConnect(string id, string idwebsocket)
        {
            if (!this.usersIdWebSocket.ContainsKey(idwebsocket))
                this.usersIdWebSocket.TryAdd(idwebsocket, id);       
        }

        public void UserDisconnect(string id, string idwebsocket)
        {
           this.usersIdWebSocket.TryRemove(idwebsocket, out string value);
        }
    }
}

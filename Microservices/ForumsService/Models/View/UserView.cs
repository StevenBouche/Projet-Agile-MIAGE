using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace ForumServices.Models.View
{
    public class UserView
    {
        [JsonPropertyName("id")]
        public string Id { get; set; }
        [JsonPropertyName("pseudo")]
        public string Pseudo { get; set; }
        [JsonPropertyName("urlPicture")]
        public string UrlPicture { get; set; }
        [JsonPropertyName("isConnected")]
        public bool IsConnected { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace ForumServices.Models.View
{
    public class ForumView
    {
        [JsonPropertyName("_id")]
        public string Id { get; set; }
        [JsonPropertyName("name")]
        public string Name { get; set; }
        [JsonPropertyName("description")]
        public string Description { get; set; }
        [JsonPropertyName("nbOnline")]
        public int NbOnline { get; set; }
        [JsonPropertyName("nbMember")]
        public int NbMember { get; set; }
        [JsonPropertyName("urlPicture")]
        public string UrlPicture { get; set; }


    }
}

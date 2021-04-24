using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace ForumServices.Models.View
{
    public class RegisterMessage
    {
        [JsonPropertyName("idForum")]
        public string Idforum { get; set; }
        [JsonPropertyName("idChannel")]
        public string Idchannel { get; set; }
        [JsonPropertyName("messageV")]
        public MessageView MessageV { get; set; }
    }

}

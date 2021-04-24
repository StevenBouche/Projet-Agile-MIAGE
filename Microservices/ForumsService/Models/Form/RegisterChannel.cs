using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace ForumServices.Models.Form
{
    public class RegisterChannel
    {
        [JsonPropertyName("nameChannel")]
        public string NameChannel { get; set; }
        [JsonPropertyName("idForum")]
        public string IdForum { get; set; }
    }
}

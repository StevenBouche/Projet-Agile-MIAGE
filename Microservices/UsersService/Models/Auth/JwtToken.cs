using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace UsersService.Models.Auth
{
    public class JwtToken
    {
        [JsonPropertyName("accessToken")]
        public string AccessToken { get; set; }

        [JsonPropertyName("expireAt")]
        public double ExpireAt { get; set; }
    }
}

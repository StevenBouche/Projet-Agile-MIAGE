using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace UsersService.Models.Auth
{
    public class RefreshToken
    {

        [JsonPropertyName("refreshToken")]
        public string Token { get; set; }
        [JsonPropertyName("expireAt")]
        public double ExpireAt { get; set; }
        [JsonPropertyName("addressIP")]
        public string AddressIP { get; set; }

        public override bool Equals(Object obj)
        {
            if (obj != null && obj is RefreshToken)
            {
                var element = obj as RefreshToken;
                return (this.Token, this.ExpireAt, this.AddressIP).Equals((element.Token, element.ExpireAt, element.AddressIP));
            }
            return false;
        }

        public override int GetHashCode()
        {
            return (this.Token, this.ExpireAt, this.AddressIP).GetHashCode();
        }


    }
}

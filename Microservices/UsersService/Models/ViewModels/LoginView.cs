using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace UsersService.Models.ViewModels
{
    public class LoginView
    {
        [JsonPropertyName("email")]
        public string Email { get; set; }
        [JsonPropertyName("password")]
        public string Password { get; set; }
        [JsonPropertyName("addressIP")]
        public string AddressIP { get; set; }
    }
}

using System;
using System.Text.Json.Serialization;
using User.Model.Users;

namespace UsersService.Models.ViewModels
{
    public class ProfilView
    {
        [JsonPropertyName("firstName")]
        public string FirstName { get; set; }
        [JsonPropertyName("lastName")]
        public string LastName { get; set; }
        [JsonPropertyName("birthdayDate")]
        public DateTime BirthdayDate { get; set; }
        [JsonPropertyName("role")]
        public UserRole Role { get; set; }
    }
}

using System;
using System.Text.Json.Serialization;
using UsersService.Models.ViewModels;

namespace User.Model.Users
{
    public enum UserRole
    {
        ADMIN, USER
    }

    public class UserProfil
    {
        [JsonPropertyName("firstName")]
        public string FirstName { get; set; }
        [JsonPropertyName("lastName")]
        public string LastName { get; set; }
        [JsonPropertyName("birthdayDate")]
        public DateTime BirthdayDate { get; set; }
        [JsonPropertyName("role")]
        public UserRole Role { get; set; }

        public ProfilView ToProfilView()
        {
            return new ProfilView
            {
                FirstName = this.FirstName,
                LastName = this.LastName,
                BirthdayDate = this.BirthdayDate,
                Role = this.Role
            };
        }

        public static UserProfil CreateUserProfilFromView(ProfilView view)
        {
            return new UserProfil()
            {
                FirstName = view.FirstName,
                LastName =view.LastName,
                BirthdayDate = view.BirthdayDate,
                Role = view.Role,
            };
        }
    }

}

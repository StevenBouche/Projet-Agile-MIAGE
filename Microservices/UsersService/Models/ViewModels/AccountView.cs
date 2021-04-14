using System.Text.Json.Serialization;

namespace UsersService.Models.ViewModels
{
    public class AccountView
    {
        [JsonPropertyName("_id")]
        public string ID { get; set; }
        [JsonPropertyName("pseudo")]
        public string Pseudo { get; set; }
        [JsonPropertyName("email")]
        public string Email { get; set; }
        [JsonPropertyName("profil")]
        public ProfilView Profil { get; set; }
        [JsonPropertyName("urlPicture")]
        public string UrlPicture { get; set; }
    }
}

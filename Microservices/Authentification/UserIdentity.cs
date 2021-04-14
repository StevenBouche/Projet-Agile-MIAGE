using System.Security.Claims;

namespace Authentification
{
    public class UserIdentity
    {
        public string ID { get; set; }
        public string Email { get; set; }
        public string AddressIP { get; set; }
        public string Role { get; set; }
        public string Pseudo { get; set; }
        public string UrlPicture { get; set; }

        public UserIdentity()
        {

        }

        public UserIdentity(ClaimsPrincipal claims)
        {
            if (claims != null)
            {
                this.ID = claims.FindFirstValue(ClaimTypes.NameIdentifier);
                this.Email = claims.FindFirstValue(ClaimTypes.Email);
                this.AddressIP = claims.FindFirstValue(CustomClaims.IPAdress);
                this.Role = claims.FindFirstValue(ClaimTypes.Role);
                this.UrlPicture = claims.FindFirstValue(CustomClaims.PictureUrl);
                this.Pseudo = claims.FindFirstValue(ClaimTypes.Surname);
            }
        }

        public Claim[] GetClaims()
        {
            return new[]
            {
                new Claim(ClaimTypes.NameIdentifier,this.ID),
                new Claim(ClaimTypes.Email,this.Email),
                new Claim(CustomClaims.IPAdress,this.AddressIP),
                new Claim(ClaimTypes.Role, this.Role),
                new Claim(ClaimTypes.Surname, this.Pseudo),
                new Claim(CustomClaims.PictureUrl, this.UrlPicture)
            };
        }

    }
}

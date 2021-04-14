using Authentification;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UsersService.Models;
using UsersService.Models.Auth;
using UsersService.Models.ViewModels;
using UsersService.Services;

namespace UsersService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AuthentificationController : ControllerBase
    {

        private readonly IUsersManager Manager;
        private readonly IJwtManager JwtManager;

        private UserIdentity Identity
        {
            get
            {
                return this.User is null ? null : new UserIdentity(this.User);
            }
        }

        public AuthentificationController(IUsersManager manager, IJwtManager jwtManager)
        {
            this.Manager = manager;
            this.JwtManager = jwtManager;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public ActionResult<LoginResult> Login([FromBody] LoginView account)
        {
            //get account by email
            Account userAccount = this.Manager.GetAccountWithUserMail(account.Email);
            var result = new LoginResult();

            //if user dont exist
            if (userAccount == null)
            {
                result.Message = "Account not found";
                return NotFound(result);
            }

            //test if correct password
            bool credentials = userAccount.Password.Equals(account.Password);
            if (!credentials)
            {
                result.Message = "Bad credential";
                return Unauthorized(result);
            }

            //get last tokens of user account
            result = new LoginResult
            {
                Message = "success",
                JwtToken = this.JwtManager.GetJwtToken(userAccount, account.AddressIP),
                RefreshToken = this.JwtManager.GetRefreshToken(userAccount, account.AddressIP, (a) => this.Manager.SaveRefreshToken(a))
            };

            return Ok(result);

        }

        [HttpPost("refresh")]
        [AllowAnonymous]
        public ActionResult<LoginResult> RefreshToken([FromBody] RefreshToken token)
        {

            Account userAccount = this.Manager.GetAccountWithRefreshToken(token);
            RefreshToken rToken = this.JwtManager.RefreshTokenIsValid(userAccount, token);

            var result = new LoginResult();

            if (rToken is null)
            {
                result.Message = "No current refresh token valid";
                return NotFound(result);
            }
            else
            {
                result.Message = "success";
                result.JwtToken = this.JwtManager.GetJwtToken(userAccount, rToken.AddressIP);
                result.RefreshToken = rToken;
            }
            return Ok(result);
        }

        [HttpPost("logout")]
        [Authorize]
        public IActionResult Logout()
        {
            this.JwtManager.RemoveRefreshToken(
                this.Manager.GetAccountById(this.Identity.ID), 
                this.Identity.AddressIP, 
                (a) => this.Manager.SaveRefreshToken(a)
            );

            return Ok();
        }
    }
}

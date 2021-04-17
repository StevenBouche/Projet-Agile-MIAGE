using Authentification;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using User.Model.Users;
using UsersService.Models;
using UsersService.Models.ViewModels;
using UsersService.Services;

namespace UsersService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {


        private readonly IUsersManager Manager;

        private UserIdentity Identity
        {
            get
            {
                return this.User is null ? null : new UserIdentity(this.User);
            }
        }



        public AccountController(IUsersManager manager)
        {
            this.Manager = manager;
        }

        [AllowAnonymous]
        [HttpPost]

        public AccountView Create([FromBody] RegisterView element)
        {
            return this.Manager.CreateAccount(
                new Account
                {
                    Profil = new UserProfil
                    {
                        FirstName = element.FirstName,
                        LastName = element.LastName,
                        Role = UserRole.USER
                    },
                    Email = element.Email,
                    Password = element.Password,
                    Pseudo = element.Pseudo,
                    Image =element.Image ?? string.Empty,
                    AdressIPAuthorize = new List<string> { element.AddressIP }
                }).ToAccountView();
        }

        [HttpGet("identity")]

        public ActionResult<AccountView> MyIdentity()
        {
            return Ok(this.Manager.GetAccountById(this.Identity.ID).ToAccountView());
        }


        [AllowAnonymous]
        [HttpGet("picture/{id}")]

        public ActionResult<string> UserPicture(string id)
        {
            var img = this.Manager.GetPictureUser(id);
            var items = img.Split(new char[] { ',', ':', ';' });
            var type = items[1];
            var image = items[3];
            byte[] b = Convert.FromBase64String(image);
            return new FileContentResult(b, type);
        }

        [HttpGet("{id}")]
        public ActionResult<AccountView> Get(string id)
        {
            if (this.Identity.Role.Equals("ADMIN"))
                return Ok(this.Manager.GetAccountById(id).ToAccountView());
            else return Unauthorized();
        }

        [HttpGet]
        public ActionResult<List<AccountView>> Get()
        {
            if(this.Identity.Role.Equals("ADMIN"))
                return Ok(this.Manager.GetAllAccount().Select(account => account.ToAccountView()).ToList());
            else return Unauthorized();
        }

        [HttpPut]
        public AccountView Put([FromBody] AccountView element)
        {
            element.ID = this.Identity.ID;
            this.Manager.UpdateAccountFromView(element);
            return element;
        }
    }
}

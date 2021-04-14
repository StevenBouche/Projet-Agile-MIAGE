using MongoDB.Driver;
using MongoDBAccess;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UsersService.Models;
using UsersService.Models.Auth;
using UsersService.Models.ViewModels;

namespace UsersService.Services
{

    public interface IUsersManager
    {
        Account CreateAccount(Account element);
        DeleteResult DeleteAccount(string id);
        List<Account> GetAllAccount();
        Account GetAccountById(string element);
        Account UpdateAccount(Account element);
        Account GetAccountWithUserMail(string email);
        void SaveRefreshToken(Account userAccount);
        void UpdateAccountFromView(AccountView element);
        List<AccountView> GetAllAccountView();
        Account GetAccountWithRefreshToken(RefreshToken token);
        string GetPictureUser(string id);
    }

    public class UsersManager : IUsersManager
    {

        private readonly IMongoDBContext<Account> Context;

        public UsersManager(IMongoDBContext<Account> context)
        {
            this.Context = context;
        }

        public Account CreateAccount(Account element)
        {
            throw new NotImplementedException();
        }

        public DeleteResult DeleteAccount(string id)
        {
            throw new NotImplementedException();
        }

        public Account GetAccountById(string element)
        {
            throw new NotImplementedException();
        }

        public Account GetAccountWithRefreshToken(RefreshToken token)
        {
            throw new NotImplementedException();
        }

        public Account GetAccountWithUserMail(string email)
        {
            throw new NotImplementedException();
        }

        public List<Account> GetAllAccount()
        {
            throw new NotImplementedException();
        }

        public List<AccountView> GetAllAccountView()
        {
            throw new NotImplementedException();
        }

        public string GetPictureUser(string id)
        {
            throw new NotImplementedException();
        }

        public void SaveRefreshToken(Account userAccount)
        {
            throw new NotImplementedException();
        }

        public Account UpdateAccount(Account element)
        {
            throw new NotImplementedException();
        }

        public void UpdateAccountFromView(AccountView element)
        {
            throw new NotImplementedException();
        }
    }
}

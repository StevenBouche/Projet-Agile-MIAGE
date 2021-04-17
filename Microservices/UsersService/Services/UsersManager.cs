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
        private object userAccount;

        public UsersManager(IMongoDBContext<Account> context)
        {
            this.Context = context;
        }

        public Account CreateAccount(Account element)
        {
            int nbAccountWithSameMail = this.Context.GetQueryable().Where(acc => acc.Email.Equals(element.Email)).Count();
            if (nbAccountWithSameMail == 0)
            {
                this.Context.GetCollection().InsertOne(element);
            }
            return element;
        }

        public DeleteResult DeleteAccount(string id)
        {
            return this.Context.GetCollection().DeleteOne(acc => acc.ID.Equals(id));
        }

        public Account GetAccountById(string element)
        {
            return this.Context.GetQueryable().FirstOrDefault(account => account.ID.Equals(element));
        }

        public Account GetAccountWithRefreshToken(RefreshToken token)
        {
            List<Account> list = this.Context.GetQueryable().ToList();
            return list.FirstOrDefault(account => account.RefreshTokens.FirstOrDefault(refresh => refresh.Token.Equals(token.Token)) != null);
        }

        public Account GetAccountWithUserMail(string email)
        {
            return this.Context.GetQueryable().FirstOrDefault(account => account.Email.Equals(email));
        }

        public List<Account> GetAllAccount()
        {
            return this.Context.GetQueryable().ToList();
        }

        public List<AccountView> GetAllAccountView()
        {
            return this.Context
                            .GetQueryable()
                            .Select(account => account.ToAccountView())
                            .ToList();
        }

        public string GetPictureUser(string id)
        {
            return this.Context.GetQueryable().FirstOrDefault(User => User.ID == id).Image;
        }

        public void SaveRefreshToken(Account userAccount)
        {
            var update = Builders<Account>.Update.Set(account => account.RefreshTokens, userAccount.RefreshTokens);
            this.Context.GetCollection().UpdateOne(account => account.ID.Equals(userAccount.ID), update);
        }

        public Account UpdateAccount(Account element)
        {
            this.Context.GetCollection().ReplaceOne(acc => acc.ID.Equals(element.ID), element);
            return element;
        }

        public void UpdateAccountFromView(AccountView element)
        {
            Account a = this.GetAccountById(element.ID);

            if (a is null) return;

            a.UpdateFromView(element);
            this.UpdateAccount(a);
        }
    }
}

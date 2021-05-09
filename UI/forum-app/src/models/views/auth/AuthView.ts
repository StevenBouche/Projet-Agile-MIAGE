enum UserRole {
    ADMIN = 0,
    USER = 1
}

class LoginView {
    public email: string;
    public password: string;
    public AddressIP: string;
}

class RegisterView {
  public firstName: string;
  public lastName: string;
  public email: string;
  public password: string;
  public addressIP: string;
  public pseudo: string;
  public image : string;
}

class ProfilView {
  public firstName:	string;
  public lastName:	string;
  public birthdayDate	:string;
  public role	: number;
}

class AccountView{
  public _id : string;
  public pseudo: string;
  public email: string;
  public profil: ProfilView;
  public urlPicture: string;
}

export {UserRole, LoginView, RegisterView, ProfilView, AccountView}

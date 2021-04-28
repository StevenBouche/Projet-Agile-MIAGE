export interface SignUpResult {
  _id: string;
  pseudo: string;
  email: string;
  profil: Profil;
  urlPicture: string;
}

export interface Profil {
  firstName: string;
  lastName: string;
  birthdayDate: string;
  role: number;
}

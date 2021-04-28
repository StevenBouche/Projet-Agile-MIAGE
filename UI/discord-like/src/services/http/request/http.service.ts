import { SignUpResult } from './../../../models/signup/signup-model';
import { SignUpData } from './../../../data/signup/signup-data';
import { LoginData } from './../../../data/auth/auth-data';
import { environment } from './../../../environments/environment';
import { LoginResult } from './../../../models/auth/auth-model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient) {}

  login(data: LoginData): Observable<LoginResult> {
    return this.http.post<LoginResult>(`${environment.apiUrl}/Authentification/login`, {
      email: data.email,
      password: data.password,
      addressIp: data.adressIP,
    });
  }

  signUp(data: SignUpData): Observable<SignUpResult> {
    return this.http.post<SignUpResult>(`${environment.apiUrl}/Account`, {
      firstName: data.firstName,
      LastName: data.LastName,
      email: data.email,
      password: data.password,
      addressIP: data.addressIP,
      pseudo: data.pseudo,
      image: data.image,
    });
  }
}

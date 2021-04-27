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
}

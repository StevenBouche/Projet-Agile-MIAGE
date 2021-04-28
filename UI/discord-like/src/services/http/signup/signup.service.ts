import { SignUpData } from './../../../data/signup/signup-data';
import { HttpService } from './../request/http.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SignUpResult } from 'src/models/signup/signup-model';

@Injectable({
  providedIn: 'root',
})
export class SignUpService {
  constructor(private http: HttpService) {}

  signup(data: SignUpData): Observable<SignUpResult> {
    return this.http.signUp(data);
  }
}

import { IpService } from './../../services/http/auth/ip.service';
import { LoginData } from './../../data/auth/auth-data';
import { AuthService } from './../../services/http/auth/auth.service';
import { NotificationService } from './../../services/notifications/notification.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  loading: boolean;
  loginForm: FormGroup;
  email: string;
  password: string;
  ipAdress: string;

  constructor(private notifs: NotificationService, private authService: AuthService, private ip: IpService) {}

  ngOnInit(): void {
    this.loading = true;
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern(new RegExp('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'))]),
      pwd: new FormControl('', [Validators.required]),
    });
    this.getIpAdress();
  }

  onSubmit(): void {
    this.loading = true;

    const data: LoginData = {
      email: this.getMail?.value,
      password: this.getPwd?.value,
      adressIP: this.ipAdress,
    };

    this.authService.login(data).subscribe((loginResult) => {
      this.authService.setAccessToken(loginResult.jwtToken);
      console.log(loginResult.jwtToken);
      this.loading = false;
    });
  }

  getIpAdress() {
    this.ip.getIPAddress().subscribe((res: any) => {
      this.ipAdress = res.ip;
      console.log(this.ipAdress);
      this.loading = false;
    });
  }

  get getMail() {
    return this.loginForm.get('email');
  }

  get getPwd() {
    return this.loginForm.get('pwd');
  }
}

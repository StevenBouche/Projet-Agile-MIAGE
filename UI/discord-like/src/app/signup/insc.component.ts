import { SignUpResult } from './../../models/signup/signup-model';
import { SignUpService } from './../../services/http/signup/signup.service';
import { SignUpData } from './../../data/signup/signup-data';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { IpService } from './../../services/http/auth/ip.service';

@Component({
  selector: 'app-insc',
  templateUrl: './insc.component.html',
  styleUrls: ['./insc.component.css'],
})
export class InscComponent implements OnInit {
  loading: boolean;
  SignUpForm: FormGroup;
  firstName: string;
  LastName: string;
  email: string;
  password: string;
  addressIP: string;
  pseudo: string;
  image: string;

  constructor(private ip: IpService, private sgService: SignUpService) {}

  ngOnInit(): void {
    this.loading = true;
    this.SignUpForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      LastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.pattern(new RegExp('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'))]),
      password: new FormControl('', [Validators.required]),
      pseudo: new FormControl('', [Validators.required]),
      image: new FormControl('', [Validators.required]),
    });
    this.getIpAdress();
  }

  onSubmit(): void {
    console.log('submit');

    const data: SignUpData = {
      firstName: this.getFirstName?.value,
      LastName: this.getLastName?.value,
      email: this.getEmail?.value,
      password: this.getPass?.value,
      pseudo: this.getPseudo?.value,
      image: this.getImage?.value,
      addressIP: this.addressIP,
    };

    this.sgService.signup(data).subscribe((sgResult) => {
      console.log(sgResult._id);
    });
  }

  getIpAdress() {
    this.ip.getIPAddress().subscribe((res: any) => {
      this.addressIP = res.ip;
      console.log(this.addressIP);
      this.loading = false;
    });
  }

  get getFirstName() {
    return this.SignUpForm.get('firstName');
  }

  get getLastName() {
    return this.SignUpForm.get('LastName');
  }

  get getEmail() {
    return this.SignUpForm.get('email');
  }

  get getPass() {
    return this.SignUpForm.get('password');
  }

  get getPseudo() {
    return this.SignUpForm.get('pseudo');
  }

  get getImage() {
    return this.SignUpForm.get('image');
  }
}

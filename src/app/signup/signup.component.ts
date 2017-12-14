import { Component, OnInit, ViewChild  } from '@angular/core';
import {SignService} from './sign.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import {MatSnackBar} from '@angular/material';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./assets/css/toolkit-light.css', './signup.component.css']
})
export class SignupComponent implements OnInit {
// title = 'app';
loading = false;
   @ViewChild('f') form: NgForm;
  data = {
    username: '',
    password: '',
    first_name: '',
    last_name: '',
    phone_no: '',
    email: ''
  };
  success = false;
  constructor(public snackBar: MatSnackBar, private serverService: SignService, private router: Router, private _cookieService: CookieService) { }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
  onSave() {
    this.loading=true;
    this.data = {
      username: this.form.value.username,
      password: this.form.value.password,
      first_name: this.form.value.first,
      last_name: this.form.value.last,
      phone_no: this.form.value.phone,
      email: this.form.value.email
    };
    console.log(this.form);
    this.serverService.sendSignUpData(this.data).subscribe(
    (response) => {console.log(response);
      this.success = true;
      this.loading=false;
     },
    (error) => {
      console.log(error);
      this.openSnackBar("Error signing up",'');
      this.loading=false;
     }
    );
  }
  Signup = () => {
    console.log(this._cookieService.get('token'));
  }

  ngOnInit() {
  }
}

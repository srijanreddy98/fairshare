import { Component, OnInit, ViewChild  } from '@angular/core';
import {ServerService} from './server.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Http, Headers } from '@angular/http';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css',
'./css/application.css',
'./css/toolkit.css']
})
export class LoginComponent implements OnInit {
  title = 'app';
  loading = false;
  @ViewChild('f') form: NgForm;
  data = {
    username: 'null',
    password: 'null'
  };
  res= '';
  constructor(private serverService: ServerService, private router: Router, private _cookieService: CookieService) { }
  onSave() {
    this.data = {
      username: this.form.value.username,
      password: this.form.value.password
    };
    this.loading = true;
    this.serverService.sendSignUpData(this.data).subscribe(
      (re) => {
        this.res = re.text().split(':')[1];
        this.res = 'Jwt ' + this.res.slice(1, -2);
        console.log(this.res);
        const headers = new Headers({ 'Authorization': this.res });
        this._cookieService.put('token' , this.res);
        this._cookieService.put('username', this.data.username);
        this.loading = false;
        this.router.navigate(['usermain/screen/individual']);
      },
      (err) => { console.log(err); this.loading = false; }
    );
  }
  Signup = () => {
    this.router.navigate(['signup']);
  }

  ngOnInit() {
    // if (this._cookieService.get('username') !== '') {
    //   this.router.navigate(['usermain']);
    // }
  }

}

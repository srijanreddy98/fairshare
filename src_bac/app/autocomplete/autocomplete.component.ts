import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Http, Headers } from '@angular/http';
import { CookieService } from 'ngx-cookie';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import { UserService } from '../usermain/user.service';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.css']
})
export class AutocompleteComponent {
  myControl: FormControl;
  filteredUsers: Observable<any[]>;
  @ViewChild('f') form: NgForm;
  username= '';
  addexpamt= '';
  tryAddExp = false;
  successAddExp = false;
  errAddExp = false;
  users: any[] = [
    {
      name: 'Rutvik',
      dues: '-600',
      flag: './assets/images/img.jpg'
    },
    {
      name: 'Srijan',
      dues: '200',
      flag: 'assets/images/img2.png'
    }
  ];
  color = 'warn';
  mode = 'indeterminate';
  constructor(private userService: UserService, private router: Router, private _cookieService: CookieService ) {
    this.myControl = new FormControl();
    this.filteredUsers = this.myControl.valueChanges
    .startWith(null)
    .map(user => user ? this.filterUsers(user) : this.users.slice());
  }
  onSave() {
    const data = {
    first_user : '',
    second_user: '',
    description: '',
    gid : -1,
    amount: 0,
    settled_up : false
    };
    console.log(this.form.value);
    data.amount = this.form.value.amount;
    data.description = this.form.value.descrip;
    if ( this.form.value.nature === '2' || this.form.value.nature === '3') {
      data.first_user = this.form.value.usernam;
      data.second_user = this._cookieService.get('username');
    }else {
      data.second_user = this._cookieService.get('username');
      data.first_user = this.form.value.usernam;
    }
    if (this.form.value.nature === '4' || this.form.value.nature === '3') {
      data.amount = data.amount / 2;
    }
    console.log(data);
    const headers = new Headers({ 'Authorization': this._cookieService.get('token') });
    this.tryAddExp = true;
    this.userService.addRecord(data, headers).subscribe(
      (addRecRes) => { console.log(addRecRes); this.tryAddExp = false; this.successAddExp = true; this.errAddExp = false; },
      (addRecErr) => { console.log(addRecErr); this.tryAddExp = false; this.successAddExp = false; this.errAddExp = true; }
    );
  }
  return() {
    this.tryAddExp = false; this.successAddExp = false; this.errAddExp = false;
  }
  filterUsers(name: string) {
    return this.users.filter(user =>
      user.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }
  reset() {
    this.myControl.reset();
  }
  ngOnChanges() {
    this.myControl.reset();
  }
}
export class SelectOverviewExample {
}

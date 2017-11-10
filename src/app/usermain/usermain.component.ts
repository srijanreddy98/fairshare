import { Component, OnInit, ViewChild} from '@angular/core';
import { Http, Headers } from '@angular/http';
import { CookieService } from 'ngx-cookie';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
declare var jquery: any;
declare var $: any;
import { UserService } from './user.service';
@Component({
  selector: 'app-usermain',
  templateUrl: './usermain.component.html',
  styleUrls: [ './assets/css/application.css', './usermain.component.css']
})

export class UsermainComponent implements OnInit {

  constructor(private userService: UserService, private router: Router, private _cookieService: CookieService ) { }
  data = '';
  @ViewChild('addexp') addExpForm: NgForm;
  final: any;
  owesMeARR = [];
  IoweThemARR = [];
  currentSelectedNum: number ;
  currentSelected = {
    first_user: '',
    second_user: '',
    gid: '',
    amount: '',
    description: '',
    settled_up: false
  } ;
  displayExpense = false;
  owesMe =
  {
    first_user: '',
    second_user: '',
    gid: '',
    amount: '',
    description: '',
    settled_up: false
  };

  IoweThem =
  {
    first_user: '',
    second_user: '',
    gid: '',
    amount: '',
    description: '',
    settled_up: false
  };
  secondUser = '';
  amt= '';
  x = '';
  user = '';
  addEx = false;
  editEx = false;
  // Add expense function next
  addExpSet = () => this.addEx = this.addEx ? false : true;
  addExpense() {
    const headers = new Headers({ 'Authorization': this._cookieService.get('token') });
    const data = {
      first_user : this._cookieService.get('username'),
      second_user : this.addExpForm.value.secUser,
      amount : this.addExpForm.value.amt,
      gid : -1,
      description: this.addExpForm.value.des,
      settled_up : false
    } ;
    if (this.addExpForm.value.typeS === '1' || this.addExpForm.value.typeS === '2') {
      data.amount = (parseFloat(data.amount) / 2).toString();
    }
    if (this.addExpForm.value.typeS === '1' || this.addExpForm.value.typeS === '3' ) {
      data.first_user = data.second_user;
      data.second_user = this._cookieService.get('username');
    }
    console.log(data);
    this.userService.addRecord(data, headers).subscribe(
      (addExpRes) => { console.log(addExpRes); this.addEx = false; },
      (addExpErr) => console.log(addExpErr)
    );
  }


  // OnInit get all records from the existing data present in the cookies
  ngOnInit() {
    if (this._cookieService.get('username') === '') {
      // this.router.navigate(['login']);
    }else {
      this.data = this._cookieService.get('username');
      const headers = new Headers({ 'Authorization': this._cookieService.get('token') });
      this.userService.head(this.data, headers).subscribe(
        (response) => {
          console.log('its working'); console.log(response); this.x = JSON.stringify(response);
          const dat = this.x.split(':');
          dat[0] = '{"body"';
          this.x = dat.join(':');
          this.final = JSON.parse(JSON.parse(this.x).body);
          for (let i = 0; i < this.final.length; i++) {
            if (this.final[i].first_user === this._cookieService.get('username')) {
              // console.log('if'+this.final[i].amount);
              this.owesMe = this.final[i];
              this.owesMeARR.push(this.owesMe);
            }else {
              // console.log('else'+this.final[i].first_user);
              this.IoweThem = this.final[i];
              this.IoweThemARR.push(this.IoweThem);
            }
          }
        },
        (error) => {
          console.log(error);
          // this.router.navigate(['login']);
        }
      );
    }
  }
  // Display data
  fun = (data) => {
    this.currentSelectedNum = data;
    this.currentSelected = this.owesMeARR[data];
    console.log(this.currentSelected);
    if (!this.addEx) {
      this.displayExpense = true;
    }
  }
  showExpSet = () => this.displayExpense = this.displayExpense ? false : true;
  editExpSet = () => { this.displayExpense = this.displayExpense ? false : true;
     this.editEx = this.editEx ? false : true; }
}

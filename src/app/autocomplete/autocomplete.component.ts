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
export class AutocompleteComponent implements OnInit{
  myControl: FormControl = new FormControl();
  filteredUsers: Observable<any[]>;
  @ViewChild('f') form: NgForm;
  username= '';
  addexpamt= '';
  tryAddExp = false;
  successAddExp = false;
  errAddExp = false;
  friendlist = [];
  requestedFriends = [];
  friendCard = false;
  filteredfriends = this.friendlist;
  data: any;
  // users: any[] = [
  //   {
  //     name: 'Rutvik',
  //     flag: './assets/images/img.jpg'
  //   },
  //   {
  //     name: 'Srijan',
  //     flag: 'assets/images/img2.png'
  //   }
  // ];
  users = [];
  color = 'warn';
  mode = 'indeterminate';
  
  constructor(private userService: UserService, private router: Router, private _cookieService: CookieService ) {
    // this.myControl = new FormControl();
    this.getFriendList();
   }
  ngOnInit() {
    
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
    split_type: 100,
    settled_up : false
    };
    //console.log(this.form.value);
    data.amount = this.form.value.amount;
    data.description = this.form.value.descrip;
    if ( this.form.value.nature === '2' || this.form.value.nature === '3') {
      data.second_user = this.form.value.usernam;
      data.first_user = this._cookieService.get('username');
    }else {
      data.first_user = this._cookieService.get('username');
      data.second_user = this.form.value.usernam;
    }
    if (this.form.value.nature === '4' || this.form.value.nature === '3') {
      data.split_type = 50;
    }
    // console.log(data);
    const headers = new Headers({ 'Authorization': this._cookieService.get('token') });
    this.tryAddExp = true;
    this.userService.addRecord(data, headers).subscribe(
      (addRecRes) => { // console.log(addRecRes); 
        this.tryAddExp = false; this.successAddExp = true; this.errAddExp = false; },
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
  // filterFriends(name: string) {
  //   return this..filter(user =>
  //     user.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
  // }
  reset() {
    this.myControl.reset();
  }
  ngOnChanges() {
  }
  getFriendList() {
    this.data = this._cookieService.get('username');
    const headers = new Headers({ 'Authorization': this._cookieService.get('token') });
    this.userService.getFriendList(this.data, headers).subscribe(
      (response3) => {
        // console.log(response3);
        const friendlist = JSON.parse(response3['_body']);
        // console.log(friendlist);
        for (const i of friendlist) {
          const det = {
            name: '',
            accepted: false,
          };
          if (i.first_user === this.data) {
            det.name = i.second_user;
            det.accepted = i.accepted_user1;
            if (det.accepted === false) {
              this.requestedFriends.push(det);
            }

          } else {
            det.name = i.first_user;
            det.accepted = i.accepted_user2;
            if (det.accepted === false) {
              this.requestedFriends.push(det);
            }
          }
          this.users.push(det);
          console.log(this.users);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }
  // applyFriendsFilter(filterValue: any) {
  //   if (!filterValue) {
  //     this.filteredfriends = this.friendlist;
  //   }
  //   this.filteredfriends = this.friendlist.filter(friendlist => friendlist.friend.indexOf(filterValue) >= 0);
  //   // filterValue = filterValue.trim(); // Remove whitespace
  //   // filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
  //   // this.dataSource.filter = filterValue;
  //   // this.filteredusers=filterValue;
  // }
}
export class SelectOverviewExample {
}

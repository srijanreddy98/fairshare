import { Component, OnInit, ViewEncapsulation, ViewChild, Input } from '@angular/core';
import { NgForm, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Http, Headers } from '@angular/http';
import { CookieService } from 'ngx-cookie';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import { UserService } from '../usermain/user.service';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-add-friends',
  templateUrl: './add-friends.component.html',
  styleUrls: ['./add-friends.component.css'],
  encapsulation: ViewEncapsulation.None
  
})

export class AddFriendsComponent implements OnInit {
  myControl: FormControl;
  username: any;
  @ViewChild('f') form: NgForm;
  loading=  false;
  success= false;
  flag= false;
  friendlist=[];
  constructor (public snackBar: MatSnackBar, private userService: UserService,
     private router: Router, private _cookieService: CookieService) {
      this.myControl = new FormControl();
      this.username=this._cookieService.get('username');
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
  onSend()
  {
    this.loading = true;
    const data = {
      first_user: '',
      second_user: '',
      accepted_user1: '',
      accepted_user2: ''
      };
      data.first_user = this.username;
      data.second_user = this.form.value.friend;
      data.accepted_user1 = '1';
      data.accepted_user2 = '0';
      console.log(data);
      const headers = new Headers({ 'Authorization': this._cookieService.get('token') });
      this.userService.addFriend(data, headers).subscribe(
        (addRecRes) => {
          console.log(addRecRes);
          this.loading =  false;
          this.success = true;
          this.form.reset();
          console.log(this.friendlist);
          for (const i of this.friendlist)
          {
            if (i.friend === data.second_user) {
              console.log(i.friend);
              this.flag = true;
            }
          }
          if (this.flag === false) {
            const notifs = 
            {
              receiver: "",
              doer : "",
              record : "",
              body : "",
              description : ""
            }
            this.openSnackBar('Friend request sent to ' + data.second_user, '');
            console.log('GANDUU');
            notifs.receiver = data.second_user;
            notifs.doer = this._cookieService.get('username');
            notifs.record = '-1';
            notifs.body = 'SFR';
            notifs.description = notifs.doer + ' sent a friend request to you' ;
            this.userService.addRecAct(notifs,headers).subscribe(
              (resp)=>
              {
                console.log(notifs);
                console.log("GANDU");
                console.log(resp);
              },
              (err) =>
              {
                console.log("HII");
                console.log(err);
              }
            );
          }else {
            this.openSnackBar(data.second_user + ' is already your friend',  '');
          }
        } ,
        (addRecErr) =>{
          console.log(addRecErr);
          this.loading = false;
          this.openSnackBar('Username does not exist', '');
        },
      );
  }
  ngOnInit() {
    const headers = new Headers({ 'Authorization': this._cookieService.get('token') });
    this.userService.getFriendList(this.username, headers).subscribe(
      (response3) => {
          // console.log(response3);
          const friendlist = JSON.parse(response3['_body']);
          for (const i of friendlist){
            const det = {
              friend : ''
            };
            if (i.first_user === this.username){
              det.friend = i.second_user;
            }else {
              det.friend = i.first_user;
            }
            this.friendlist.push(det);
          }
        console.log(this.friendlist);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}

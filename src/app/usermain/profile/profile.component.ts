import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { Http, Headers } from '@angular/http';
import { ProfileService } from './profile.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  userDetails = {
    firstName: '',
    lastName: '',
    phoneNo: '',
    username: '',
    email: '',
  };
  gettingData = false;
  color = 'warn';
  mode = 'indeterminate';
  sentReq = 0;
  recievedReq = 0;
  acceptedReq = 0;
  pendingReq = 0;
  totalFriends = 0;
  constructor(private _cookieService: CookieService, private profileService: ProfileService, private router: Router) { }
  ngOnInit() {
    console.log('hello');
    const data = {
      username : this._cookieService.get('username')
    };
    const headers = new Headers({ 'Authorization': this._cookieService.get('token') });
    this.gettingData = true;
    this.profileService.getUserProfile(data, headers).subscribe(
      (res) => {
        const body = JSON.parse(res['_body']);
        console.log(body);
        this.userDetails.firstName = body.first_name;
        this.userDetails.lastName = body.last_name;
        this.userDetails.username = body.username;
        this.userDetails.email = body.email;
        this.userDetails.phoneNo = body.phone_no;
        console.log(this.userDetails);
        this.gettingData = false;
      },
      (err) => console.log(err)
    );
    this.profileService.getFriendRequests({username: this._cookieService.get('username')}, headers).subscribe(
      (res) => {
        const body = JSON.parse(res['_body']);
        for ( const i of body) {
          if (i.first_user === this._cookieService.get('username')) {
            this.sentReq += 1;
          }else {
            this.recievedReq += 1;
            if (i.accepted_user2 === false) {
              this.pendingReq += 1;
            }
          }
          if (i.accepted_user1 === true && i.accepted_user2 === true) {
            this.totalFriends += 1;
          }
        }
      },
      (err) => console.log(err)
    );
  }
  logout() {
    this._cookieService.removeAll();
    
  }
}

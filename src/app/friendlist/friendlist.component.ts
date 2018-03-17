import {
  Component, OnInit, ViewEncapsulation, Injectable, trigger,
  state, style, transition, animate, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material';
import {MatTableDataSource} from '@angular/material';
import { CookieService } from 'ngx-cookie';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UserService } from '../usermain/user.service';
import { element } from 'protractor';
import { DataSource } from '@angular/cdk/collections';
import { ChangeDetectorRef } from '@angular/core';
import { NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-friendlist',
  templateUrl: './friendlist.component.html',
  styleUrls: ['./friendlist.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class FriendlistComponent implements OnInit {
  friendlist = [];
  requestedFriends = [];
  acceptedFriends = [];
  friendCard= false;
  data: any;
  zone: NgZone;
  rec = false;
  count = 0;
  filteredfriends = this.acceptedFriends;
  label='';
  constructor(public snackBar: MatSnackBar, private _cookieService: CookieService, private userService: UserService, private router: Router,
    private cd: ChangeDetectorRef) { }

  ngOnInit() {
      this.getFriendList();
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
  loading = false;
  getFriendList() {
      this.loading=true;
      this.data = this._cookieService.get('username');
      const headers = new Headers({ 'Authorization': this._cookieService.get('token') });
      this.userService.getFriendList(this.data, headers).subscribe(
        (response3) => {
          // console.log(response3);
          const friendlist = JSON.parse(response3['_body']);
          console.log(friendlist);
          for (const i of friendlist) {
            const det = {
              friend: '',
              accepted: false,
            };
            if (i.first_user === this.data) {
              det.friend = i.second_user;
              det.accepted = i.accepted_user1;
              if (det.accepted === false) {
                this.requestedFriends.push(det);
                this.count+=1;
              }
              else{
                this.acceptedFriends.push(det);
              }

            } else {
              det.friend = i.first_user;
              det.accepted = i.accepted_user2;
              if (det.accepted === false) {
                this.requestedFriends.push(det);
                this.count+=1;
              }
              else{
                this.acceptedFriends.push(det);
              }
            }
            this.friendlist.push(det);
          }
          this.filteredfriends = this.acceptedFriends;
          this.label = this.count.toString()+" new Requests";
          console.log(this.requestedFriends);
          this.loading=false;
        },
        (error) => {
          console.log(error);
        }
      );
    }
  applyFriendsFilter(filterValue: any) {
    if (!filterValue) {
      this.filteredfriends = this.acceptedFriends;
    }
      this.filteredfriends = this.acceptedFriends.filter(acceptedFriends => acceptedFriends.friend.indexOf(filterValue) >= 0);
    // filterValue = filterValue.trim(); // Remove whitespace
    // filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    // this.dataSource.filter = filterValue;
    // this.filteredusers=filterValue;
  }
  showAddFriend() {
    this.friendCard = true;
  }
  closeaf() {
    this.friendCard = false;
  }
  addrec() {
    this.rec = true;
  }
  closerec() {
    this.rec = false;
  }
  requestAccept(seconduser) {
    const data = {
      first_user : '',
      second_user : '',
      accepted_user1: '1',
      accepted_user2: '1'
    };
    data.second_user = seconduser;
    data.first_user = this._cookieService.get('username');
    const headers = new Headers({ 'Authorization': this._cookieService.get('token') });
    this.userService.acceptRequest(data, headers).subscribe(
      (addRecRes) => {
        console.log(addRecRes);
        this.friendlist = [];
        this.acceptedFriends = [];
        this.requestedFriends = [];
        this.count = 0;
        this.getFriendList();
        console.log(this.filteredfriends);
        this.openSnackBar('Request Accepted','');
        this.cd.detectChanges();
       },
      (addRecErr) => { console.log(addRecErr); }
    );
  }
}


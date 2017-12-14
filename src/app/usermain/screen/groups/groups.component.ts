import {
  Component, OnInit, ViewEncapsulation, Injectable, trigger,
  state, style, transition, animate, ViewChild } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';
import { NgForm, FormControl } from '@angular/forms';
import { GroupService } from './group.service';
import { UserService } from '../../user.service';
import { PageEvent } from '@angular/material';
import { MatTableDataSource } from '@angular/material';
import { element } from 'protractor';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import { MatChipInputEvent } from '@angular/material';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class GroupsComponent implements OnInit {
  myControl: FormControl;
  filteredUsers: Observable<any[]>;
  @ViewChild('f') form: NgForm;
  friendlist = [];
  friendlistB = [];
  requestedFriends = [];
  filteredfriends = this.friendlist;
  userGroups = [];
  users = [];
  records = [];
  selectedRecs = [];
  showAddFri = false;
  data = '';
  selectedGroup = [] ;
  selectedTab = {
    selectedRecord : true,
    selectedSettings : false,
    selectedActivity : false
  };
  selectedGroupIndex = 0;
  userData = [];
  loadingGroupDetails = false;
  userNameData = '';
  filteredGroups = this.userGroups;
  showGroupDetail = false;
  loading = false;
  color = 'warn';
  mode = 'indeterminate';
  visible = true;
  selectable = true;
  removable= true;
  addOnBlur = true;
  fruits = [];
  // Enter, comma
  separatorKeysCodes = [ENTER, COMMA];
  constructor(private _cookieService: CookieService, private groupService: GroupService, private router: Router,
     private userService: UserService) { }

  ngOnInit() {
    this.getUserData();
    this.getFriend();
    // console.log(this.groupService.getFriend(this._cookieService.get('username'), this._cookieService.get('token')));
    this.loading = true;
    const username = this._cookieService.get('username');
    const headers = new Headers({ 'Authorization': this._cookieService.get('token') });
    this.groupService.getGroups(username, headers).subscribe(
      (getGroupsResponse) => {
        for (const group of JSON.parse(getGroupsResponse['_body'])) {
          const g = group;
          this.userGroups.push(g);
        }
        this.loading = false;
        console.log(this.userGroups);
      },
      (error) => {
        console.log(error);
        // this.router.navigate(['login']);
      }
    );
  }
  getUserData() {
    const data = this._cookieService.get('username');
    const headers = new Headers({ 'Authorization': this._cookieService.get('token') });
    this.groupService.head(data, headers).subscribe(
      (getDataResponse) => {
        const serverData = JSON.parse(getDataResponse['_body']);
        for (const i of serverData) {
          if (i.gid !== '-1') {
            console.log(i);
            const record = {
              amt: 0,
              gid: -1,
              id: -1,
              timeCreated: '',
              lastUpdated: '',
              description: '',
              friend: '',
            };
            if (i.first_user === this.userNameData) {
              record.friend = i.second_user;
              record.amt = i.amount;
            } else {
              record.friend = i.first_user;
              record.amt = -1 * i.amount;
            }
            record.gid = i.gid;
            record.id = i.id;
            record.timeCreated = i.created;
            record.lastUpdated = i.last_changed;
            record.description = i.description;
            this.records.push(record);
          // for (const j of this.userData) {
          //   j.record.sort((a, b) => {
          //     if (a.gid < b.gid) {
          //       return -1;
          //     } else if (a.gid > b.gid) {
          //       return 1;
          //     } else {
          //       return 0;
          //     }
          //   });
          // }
        }
        console.log(this.records);
      }
    },
      (getDataError) => { console.log(getDataError); }
    );
  }
  deleteGroup() {
    const deleteGroupData = {
      gid: this.userGroups[this.selectedGroupIndex].id,
      username: this._cookieService.get('username')
      };
    const headers = new Headers({ 'Authorization': this._cookieService.get('token') });
    this.groupService.delGroup(deleteGroupData, headers).subscribe(
      (response) => {console.log(response);
      },
      (error) => console.log(error)
    );
  }
  inArray(needle) {
    const count = this.userData.length;
    for (let i = 0; i < count; i++) {
      if (this.userData[i].friend === needle) { return i; }
    }
    return -1;
  }
  showGroupHistory(id) {
    this.selectedGroupIndex = id;
    this.selectedGroup = [];
    this.showGroupDetail = true;
    this.loadingGroupDetails = true;
    const headers = new Headers({ 'Authorization': this._cookieService.get('token') });
    this.groupService.getGroupMembers(id, headers).subscribe(
      (groupResponse) => {
        for (const iteratorGroup of JSON.parse(groupResponse['_body'])) {
          this.selectedGroup.push(iteratorGroup.member);
        }
        this.loadingGroupDetails = false;
        console.log(this.selectedGroup);
      },
      (groupError) => { console.log(groupError); this.loadingGroupDetails = false; }
    );
    this.selectedRecs =  this.records.filter(item => +item.gid === id);
    console.log(this.selectedRecs);
  }
  getFriend() {
    this.data = this._cookieService.get('username');
    const headers = new Headers({ 'Authorization': this._cookieService.get('token') });
    this.groupService.getFriendList(this.data, headers).subscribe(
      (response3) => {
        // console.log(response3);
        const friendlist = JSON.parse(response3['_body']);
        // console.log(friendlist);
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
            }

          } else {
            det.friend = i.first_user;
            det.accepted = i.accepted_user2;
            if (det.accepted === false) {
              this.requestedFriends.push(det);
            }
          }
          this.friendlist.push(det);
        }
        this.filteredfriends = this.friendlist;
        this.copyFriend(this.friendlist);
        console.log(this.friendlist);
      },
      (error) => {
        console.log(error);
      }
    );
  }
  reset() {
    this.myControl.reset();
  }
  ngOnChanges() {
    this.myControl.reset();
  }
  filterUsers(name: string) {
    return this.users.filter(user =>
      user.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }
  applyFriendsFilter(filterValue: any , bool) {
    if (!filterValue && bool) {
      this.filteredfriends = this.friendlist;
    }
    this.filteredfriends = this.friendlist.filter(friendlist => friendlist.friend.indexOf(filterValue) >= 0);
    // filterValue = filterValue.trim(); // Remove whitespace
    // filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    // this.dataSource.filter = filterValue;
    // this.filteredusers=filterValue;
  }
  applyFilter(filterValue: any) {
    if (!filterValue) {
      this.filteredGroups = this.userGroups;
    }
    this.filteredGroups = this.userGroups.filter(userGroups => userGroups.name.indexOf(filterValue) >= 0);
    // filterValue = filterValue.trim(); // Remove whitespace
    // filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    // this.dataSource.filter = filterValue;
    // this.filteredusers=filterValue;
  }
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    const x = this.checkFriend(value.trim());
    // Add our fruit
    if ((value || '').trim() && x[0]) {
      this.fruits.push({ friend: value.trim(), accepted: x[1] });
      this.filteredfriends = this.filteredfriends.filter(item => item.friend !== value.trim());
      console.log(this.fruits);
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
  }
  addFriend(value) {
    const x = this.checkFriend(value.trim());
    if ((value || '').trim() && x[0]) {
      this.fruits.push({ friend: value.trim(), accepted: x[1] });
      this.filteredfriends = this.filteredfriends.filter(item => item.friend !== value.trim());
      this.friendlist = this.friendlist.filter(item => item.friend !== value.trim());
      console.log(this.fruits);
      this.applyFriendsFilter('', false);
    }
  }
  remove(fruit: any): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
      this.filteredfriends.push(fruit);
      this.friendlist.push(fruit);
    }
  }
  closeGroupDetails() {
    this.showGroupDetail = false;
    this.resetFriend(this.friendlistB);
    this.fruits = [];
    this.applyFriendsFilter('', false);
  }
  checkFriend(value) {
    for ( const i of this.filteredfriends) {
      if (i.friend === value) {
        return [true, i.accepted];
      }
    }
    return [false];
  }
  resetFriend(i) {
    this.friendlist = i;
  }
  copyFriend(i) {
    this.friendlistB = i;
  }
  tabChanged = (tabChangeEvent): void => {
    console.log('tabChangeEvent => ', tabChangeEvent);
    this.selectedTab.selectedSettings = false;
    console.log('index => ', tabChangeEvent.index);
    if (tabChangeEvent.index === 2 ) {
      this.selectedTab.selectedSettings = true;
    } else {
      this.selectedTab.selectedSettings = false;
    }
  }
  showAddFriend() {
    if ( !this.showAddFri) {
      this.resetFriend(this.friendlistB);
      for ( const i of this.selectedGroup) {
        this.filteredfriends = this.friendlist = this.friendlist.filter( item => i !== item.friend);
        console.log(i);
        console.log(this.friendlist);
      }
    this.showAddFri = true;
    }else {
    this.closeGroupDetails();
    this.showAddFri = false;
  }
  }
}

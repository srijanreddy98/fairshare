import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UserService } from '../../user.service';
@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class GroupsComponent implements OnInit {
  userGroups = [];
  selectedGroup = [] ;
  selectedGroupIndex = 0;
  userData = [];
  loadingGroupDetails = false;
  userNameData = '';
  showGroupDetail = false;
  constructor(private _cookieService: CookieService, private userService: UserService, private router: Router
    ) { }

  ngOnInit() {
    this.getUserData();
    const username = this._cookieService.get('username');
    const headers = new Headers({ 'Authorization': this._cookieService.get('token') });
    this.userService.getGroups(username, headers).subscribe(
      (getGroupsResponse) => {
        for (const group of JSON.parse(getGroupsResponse['_body'])) {
          const g = group;
          this.userGroups.push(g);
        }
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
    this.userService.head(data, headers).subscribe(
      (getDataResponse) => {
        const serverData = JSON.parse(getDataResponse['_body']);
        for (const i of serverData) {
          const record = {
            amt: 0,
            gid: -1,
            id: -1,
            timeCreated: '',
            lastUpdated: '',
            description: ''
          };
          const data = {
            friend: '',
            record: [],
            netamt: 0,
          };
          let amt = 0;
          if (i.first_user === this.userNameData) {
            data.friend = i.second_user;
            amt = i.amount;
          } else {
            data.friend = i.first_user;
            amt = -1 * i.amount;
          }
          record.amt = amt;
          record.gid = i.gid;
          record.id = i.id;
          record.timeCreated = i.created;
          record.lastUpdated = i.last_changed;
          record.description = i.description;
          const index = this.inArray(data.friend);
          if (index === -1) {
            data.netamt = amt;
            data.record.push(record);
            this.userData.push(data);
          } else {
            this.userData[index].record.push(record);
          }
        }
        console.log(this.userData);
        for (const i of this.userData) {
          i.record.sort((a, b) => {
            if (a.id < b.id) {
              return -1;
            } else if (a.id > b.id) {
              return 1;
            } else {
              return 0;
            }
          });
        }
      },
      (getDataError) => { console.log(getDataError); }
    );
  }
  showGroup(id: any) {
    this.selectedGroupIndex = id;
    this.selectedGroup = [];
    this.showGroupDetail = true;
    this.loadingGroupDetails = true;
    const headers = new Headers({ 'Authorization': this._cookieService.get('token') });
    this.userService.getGroupMembers(this.userGroups[id].id, headers).subscribe(
      (groupResponse) => {
        for (const iteratorGroup of JSON.parse(groupResponse['_body'])) {
          this.selectedGroup.push(iteratorGroup.member);
        }
        this.loadingGroupDetails = false;
      },
      (groupError) => { console.log(groupError); this.loadingGroupDetails = false; }
    );
  }
  deleteGroup() {
    const deleteGroupData = {
      gid: this.userGroups[this.selectedGroupIndex].id,
      username: this._cookieService.get('username')
      };
    const headers = new Headers({ 'Authorization': this._cookieService.get('token') });
    this.userService.delGroup(deleteGroupData, headers).subscribe(
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
}

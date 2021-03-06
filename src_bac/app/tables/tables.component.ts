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

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.css'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('divState', [
      state('small', style({
        // 'width':'0px',
        // 'height':'0px'
        'opacity': '0'
      })),
      state('big', style({
        // 'width':'1000px',
        // 'height':'1000px'
        'opacity': '1'
      })),
      transition('small=>big', animate(1000))
    ])
  ]
})
export class TablesComponent implements OnInit {
  color = 'warn';
  mode = 'indeterminate';
  @ViewChild('f') form: NgForm;
  loading = false;
  showingExp = false;
  showHist = false;
  data: any;
  showExpense = [];
  editExp = false;
  selectedFriend = [];
  userData = [];
  currSel = [0, 0];
  displayedColumns = ['amt', 'gid', 'id', 'timeCreated', 'lastUpdated', 'description'];
  dataSource = [];
  descrip = 'Hello123';
  state = 'small';
  allow = true;
  display = false;
  displayI = false;
  displayG = false;
  length = 100;
  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 100];
  pageEvent: PageEvent;
  selectedExpense = {
    amt: 0,
    gid: -1,
    id: -1,
    timeCreated: '',
    lastUpdated: '',
    description: '',
    settled_up: false
  };
  selectedUser = {
    friend: '',
    name: '',
    record: [],
    netamt: 0,
    rec: ''
  };
  friendlist = [];
  show = 3;
  friendCard = false;
  editRecord = false;
  constructor(private _cookieService: CookieService, private userService: UserService, private router: Router) { }

  panelOpenState = false;

  users: any[] = [
    {
      name: 'Rutvik',
      dues: '-600',
      // flag: './assets/images/img.jpg'
    },
    {
      name: 'Srijan',
      dues: '200',
      // flag: 'assets/images/img2.png'
    }


  ];
  filteredusers = this.userData;
  filteredfriends = this.friendlist;
  setPageSizeOptions(setPageSizeOptionsInput: string) {
    this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
  }
  ngOnInit() {
    if (this._cookieService.get('username') === '') {
      // this.router.navigate(['login']);
    } else {
      this.loading = true;
      this.data = this._cookieService.get('username');
      const headers = new Headers({ 'Authorization': this._cookieService.get('token') });
      this.userService.getFriendList(this.data, headers).subscribe(
        (response3) => {
            // console.log(response3);
            const friendlist = JSON.parse(response3['_body']);
            for (const i of friendlist){
              const det = {
                friend : ''
              };
              if (i.first_user === this.data) {
                det.friend = i.second_user;
              } else {
                det.friend = i.first_user;
              }
              this.friendlist.push(det);
            }
            // console.log(this.friendlist);
        },
        (error) => {
          console.log(error);
        }
      );
      this.userService.head(this.data, headers).subscribe(
        (getDataResponse) => {
          console.log(getDataResponse);
          const serverData = JSON.parse(getDataResponse['_body']);
          console.log(serverData);
          for (const i of serverData) {
            const record = {
              amt: 0,
              gid: -1,
              id: -1,
              timeCreated: '',
              lastUpdated: '',
              description: '',
              settled_up: false
            };
            const data = {
              friend: '',
              name: '',
              record: [],
              netamt: 0,
              rec: ''
            };
            let amt = 0;
            if (i.first_user === this.data) {
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
              if (data.netamt < 0) {
                data.rec = 'You owe ' + data.friend + ' ';
              }else {
                data.rec = 'He owes you ' ;
              }
              data.record.push(record);
              this.userData.push(data);
              this.users.push({
                name: data.friend,
                dues: data.netamt.toString()
              });
            } else {
              this.userData[index].netamt += record.amt;
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
          for (const dat of this.userData) {
            console.log(dat.record);
            const a = new MatTableDataSource(dat.record);
            this.dataSource.push(a);
          }
          console.log(this.dataSource);
          this.loading = false;
        },
        (getDataError) => { console.log(getDataError); this.loading = false; }
      );
    }
  }
  inArray(needle) {
    const count = this.userData.length;
    for (let i = 0; i < count; i++) {
      if (this.userData[i].friend === needle) { return i; }
    }
    return -1;
  }
  closeaf() {
    this.friendCard = false;
  }
  showAddFriend() {
    this.friendCard = true;
  }
  showExp(i) {
    this.selectedExpense = this.selectedUser.record[i];
    this.showingExp = true;
  }
  showHistory(index) {
    this.showHist = true;
    this.selectedUser = this.userData[index];
    console.log(this.selectedUser.friend);
  }
  closeRec() {
  this.showHist = false;
  }
  closeExp() {
    this.showingExp = false;
  }
  editExpense() {
    this.editExp = this.editExp ? false : true;
  }
  onSave() {
    const headers = new Headers({ 'Authorization': this._cookieService.get('token') });
    console.log(this.form.value);
    const f = this.form.value;
    const data = {
      first_user: '',
      second_user: '',
      description: '',
      gid: -1,
      id: this.selectedExpense.id,
      amount: 0,
      settled_up: false
    };
    if (f.amount === undefined) {
      data.amount = this.selectedExpense.amt;
    } else {
      data.amount = f.amount;
    }
    if (f.descrip === '') {
      data.description = this.selectedExpense.description;
    } else {
      data.description = f.descrip;
    }
    if (data.amount > 0) {
      data.first_user = this._cookieService.get('username');
      data.second_user = this.selectedUser.friend;
    } else {
      data.first_user = this.selectedUser.friend;
        data.second_user =  this._cookieService.get('username');
    }
    this.userService.editRecord(data, headers).subscribe(
      (editRecRes) => console.log(editRecRes),
      (editRecErr) => console.log(editRecErr)
    );
  }
  applyFilter(filterValue: any) {
    if (!filterValue) {
      this.filteredusers = this.userData;
    }
      this.filteredusers = this.userData.filter(userData => userData.friend.indexOf(filterValue) >= 0);
    // filterValue = filterValue.trim(); // Remove whitespace
    // filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    // this.dataSource.filter = filterValue;
    // this.filteredusers=filterValue;
  }
  applyFriendsFilter(filterValue: any) {
    if (!filterValue) {
      this.filteredfriends = this.friendlist;
    }
      this.filteredfriends = this.friendlist.filter(friendlist => friendlist.friend.indexOf(filterValue) >= 0);
    // filterValue = filterValue.trim(); // Remove whitespace
    // filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    // this.dataSource.filter = filterValue;
    // this.filteredusers=filterValue;
  }
  twitch() {
    this.state = 'big';
  }
  on() {
    this.state = 'small';
    if (!this.display) {
      this.display = true;
      console.log(this.users);
    } else {
      this.off();
    }

    this.displayI = false;
    this.displayG = false;

  }

  off() {
    this.state = 'small';
    this.display = false;
    this.displayI = false;
    this.displayG = false;
  }
  onI() {
    this.state = 'small';
    if (!this.displayI) {
      this.displayI = true;
    } else {
      this.displayI = false;
    }
    this.displayG = false;
    this.twitch();
  }

  offI() {
    this.state = 'small';
    this.displayI = false;
  }
  onG() {
    this.state = 'small';
    if (!this.displayG) {
      this.state = 'small';
      this.displayG = true;
    } else {
      this.displayG = false;
    }
    this.displayI = false;
    this.twitch();
  }

  offG() {
    this.state = 'small';
    this.displayG = false;
  }
  addExpense(i) {
    this.on();
    this.onI();
  }
}
export interface Element {
  description: string;
  amt: string;
  timeCreated: string;
  lastUpdated: string;
  id: string;
  gid: string;
}

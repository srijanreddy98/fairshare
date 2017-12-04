import {
  Component, OnInit, ViewEncapsulation, Injectable, trigger,
  state, style, transition, animate } from '@angular/core';
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
  loading = false;
  showingExp = false;
  data: any;
  showExpense = [];
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
    description: ''
  };
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
      this.userService.head(this.data, headers).subscribe(
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
              data.record.push(record);
              this.userData.push(data);
              this.users.push({
                name: data.friend,
                dues: data.netamt.toString()
              });
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

  showExp(i) {
    console.log(this.userData[i[0]].record[i[1]]);
    this.selectedExpense = this.userData[i[0]].record[i[1]];
    this.showingExp = true;
  }
  closeExp(i) {
    this.showingExp = false;
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

import { Component, OnInit, ViewEncapsulation, Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UserService } from '../../user.service';
@Injectable ()
@Component({
  selector: 'app-individual',
  templateUrl: './individual.component.html',
  styleUrls: ['./individual.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class IndividualComponent implements OnInit {
  loading = false;
  data: any;
  showExpense = [];
  selectedFriend = [];
  constructor(private _cookieService: CookieService, private userService: UserService, private router: Router) { }
  userData = [];
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
          for (let i of serverData) {
            const record = {
            amt: 0,
            gid: -1,
            id: -1,
            timeCreated: '',
            lastUpdated: '',
            description: ''
          };
          const data = {
            friend : '',
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
            }else {
              this.userData[index].record.push(record);
            }
          }
          console.log(this.userData);
          for (let i of this.userData) {
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
  showExp = (i: any) => {
    this.showExpense[i] = this.showExpense[i] ? false : true;
  }
  getColor = (i: any) => {
    console.log(i);
    return true;
  }
}

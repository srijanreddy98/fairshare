import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { UserService } from '../usermain/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PersonalComponent implements OnInit {
  tiles = [
    {text: 'One', cols: 3, rows: 1, color: 'lightblue'},
    {text: 'Two', cols: 1, rows: 2, color: 'lightgreen'},
    {text: 'Three', cols: 1, rows: 1, color: 'lightpink'},
    {text: 'Four', cols: 2, rows: 1, color: '#DDBDF1'},
  ];
  data: any;
  constructor(public _cookieService: CookieService, private userService: UserService, private router: Router) {
  }
  personal = [];

  ngOnInit() {
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
            category̤: '',
            description: '',
            split_type: 100,
            settled_up: false
          };
          if (i.first_user === i.second_user) {
              this.personal.push(i);

          }
        }
        console.log(this.personal);
      },
    (error) => {
    });
  }
}

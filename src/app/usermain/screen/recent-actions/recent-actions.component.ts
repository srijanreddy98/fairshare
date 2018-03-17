import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { UserService } from '../../user.service';
import { Http, Headers } from '@angular/http';

@Component({
  selector: 'app-recent-actions',
  templateUrl: './recent-actions.component.html',
  styleUrls: ['./recent-actions.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class RecentActionsComponent implements OnInit {
  

  data = '';
  exRec = false;
  

  constructor( private _cookieService: CookieService, private userService: UserService ) { }

  ngOnInit() {
    const headers = new Headers({ 'Authorization': this._cookieService.get('token') });
    this.getActions();
  }
  act = [];
  loading=false;
  getActions(){
    this.loading =true;
    const headers = new Headers({ 'Authorization': this._cookieService.get('token') });
    this.data = this._cookieService.get('username');
    this.userService.getRecAct(this.data, headers).subscribe(
      (res) => {
        const actions = JSON.parse(res['_body']);
        for (const i of actions.reverse()){
          const notifs = {
            notification : {
              created : '',
              description : '',
              doer: '',
              record : '',
            },
            record : {
              amount : '',
              created : '',
              description : '',
            }
          };
          notifs.notification = i.notification;
          notifs.record = i.record;
          if (i.notification.record !== -1)
          {
            notifs.record.created = i.record.created.substring(0,10);
          }
          this.act.push(notifs);
        }
        console.log(actions);
        this.loading=false;
      },
      (err) => {
        console.log(err);
      }
    )
  }

}

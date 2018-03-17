import {
  Component, OnInit, ViewEncapsulation, trigger,
  state,
  style,
  transition,
  animate,  ElementRef  } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from "ngx-cookie";
import * as jQuery from 'jquery';
declare var jQuery: any;
@Component({
  selector: 'app-screen',
  templateUrl: './screen.component.html',
  styleUrls: ['./screen.component.css'],
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
export class ScreenComponent implements OnInit {

  username = '';
  activeLinkIndex = -1;
  routeLinks = [];
  state = 'small';
  allow = true;
  display = false;
  displayI = false;
  displayG = false;
  constructor(private el:ElementRef, private _cookieservice:CookieService, private router: Router) {
    this.routeLinks = [
      {
        label: 'Records',
        link: './individual',
        index: 0
      }, {
        label: 'groups',
        link: './group',
        index: 1
      }, {
        label: 'Product 3',
        link: './recent-activity',
        index: 2
      }
    ];
    setTimeout(() => {
      this.allow = false;
    }, 2000);
  }
  twitch() {
    this.state = 'big';
  }
  on() {
    this.state = 'small';
    if (!this.display) {
      this.display = true;
    }else {
      this.off();
    }

    this.displayI = false;
    this.displayG = false;

  }
  logout(){
    this._cookieservice.removeAll();
    this.router.navigate(['/login']);
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
    }else {
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
    }else {
      this.displayG = false;
    }
    this.displayI = false;
    this.twitch();
  }

  offG() {
    this.state = 'small';
    this.displayG = false;
  }

  ngOnInit() {
     jQuery(this.el.nativeElement).find('.button-collapse').sideNav();
    this.router.events.subscribe((res) => {
      this.activeLinkIndex = this.routeLinks.indexOf(this.routeLinks.find(tab => tab.link === '.' + this.router.url));
    });
  }

}

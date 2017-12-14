import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Http, Headers } from '@angular/http';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(private router: Router) { }
  login = () => {
    this.router.navigate(['login']);
  }
  ngOnInit() {
  }

}

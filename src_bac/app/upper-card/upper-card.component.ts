import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
@Component({
  selector: 'app-upper-card',
  templateUrl: './upper-card.component.html',
  styleUrls: ['./upper-card.component.css']
})
export class UpperCardComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

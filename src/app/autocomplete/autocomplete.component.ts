import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.css']
})
export class AutocompleteComponent{



  myControl: FormControl;
  filteredUsers : Observable<any[]>
  username="";
  addexpamt="";


  users: any[] = [
    {
      name: 'Rutvik',
      dues: '-600',
      flag: './assets/images/img.jpg'
    },
    {
      name: 'Srijan',
      dues: '200',
      flag: 'assets/images/img2.png'
    }
  ];
  constructor()
  {
    this.myControl = new FormControl();
    this.filteredUsers=this.myControl.valueChanges
    .startWith(null)
    .map(user => user ? this.filterUsers(user): this.users.slice());
  }
  filterUsers(name: string) {
    return this.users.filter(user =>
      user.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }
  reset()
  {
    this.myControl.reset()
  }
  ngOnChanges(){
    this.myControl.reset();
  }
}




export class SelectOverviewExample {
}

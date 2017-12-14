import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { Http, Headers } from '@angular/http';
import { CookieService } from 'ngx-cookie';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { saveAs } from 'file-saver';
declare var jQuery: any;
import { UserService } from './user.service';
@Component({
  selector: 'app-usermain',
  templateUrl: './usermain.component.html',
  styleUrls: [ './usermain.component.css']
})

export class UsermainComponent implements OnInit {

  constructor(private el:ElementRef, private userService: UserService, private router: Router, private _cookieService: CookieService ) {
    this.username = this._cookieService.get('username');
  }
  data = '';
  imageToShow: any;
  isImageLoading: false;
  @ViewChild('addexp') addExpForm: NgForm;
  @ViewChild('editexp') editExpForm: NgForm; // For viewing the contents of the add expense form
  final: any; // Its is the vairable which gets the all the recordds of a user
  owesMeARR = [];
  IoweThemARR = [];
  currentSelectedNum: number ;
  currentSelected = {
    first_user: '',
    second_user: '',
    id: '',
    gid: '',
    amount: '',
    description: '',
    settled_up: false
  } ;
  displayExpense = false;
  owesMe =
  {
    first_user: '',
    second_user: '',
    id: '',
    gid: '',
    amount: '',
    description: '',
    settled_up: false
  };

  IoweThem =
  {
    first_user: '',
    second_user: '',
    id: '',
    gid: '',
    amount: '',
    description: '',
    settled_up: false
  };
  secondUser = '';
  amt= '';
  secUser = '';
  x = '';
  user = '';
  addEx = false;
  editEx = false;
  addPhoto = false;
  username = '';
  // Add expense function next
  addExpSet = () => this.addEx = this.addEx ? false : true;
  addExpense() {
    const headers = new Headers({ 'Authorization': this._cookieService.get('token') });


    const data = {
      first_user : this._cookieService.get('username'),
      second_user : this.addExpForm.value.secUser,
      amount : this.addExpForm.value.amt,
      gid : -1,
      description: this.addExpForm.value.des,
      settled_up : false
    } ;
    if (this.addExpForm.value.typeS === '1' || this.addExpForm.value.typeS === '2') {
      data.amount = (parseFloat(data.amount) / 2).toString();
    }
    if (this.addExpForm.value.typeS === '1' || this.addExpForm.value.typeS === '3' ) {
      data.first_user = data.second_user;
      data.second_user = this._cookieService.get('username');
    }
    console.log(data);
    this.userService.addRecord(data, headers).subscribe(
      (addExpRes) => { console.log(addExpRes); this.addEx = false; },
      (addExpErr) => console.log(addExpErr)
    );
  }


  // OnInit get all records from the existing data present in the cookies
  ngOnInit() {
    jQuery(this.el.nativeElement).find('.button-collapse').sideNav();
    if (this._cookieService.get('username') === '') {
      // this.router.navigate(['login']);
    }else {
      this.data = this._cookieService.get('username');
      const headers = new Headers({ 'Authorization': this._cookieService.get('token') });
      this.userService.head(this.data, headers).subscribe(
        (response) => {
          this.x = JSON.stringify(response);
          const dat = this.x.split(':');
          dat[0] = '{"body"';
          this.x = dat.join(':');
          this.final = JSON.parse(JSON.parse(this.x).body);
          for (let i = 0; i < this.final.length; i++) {
            if (this.final[i].first_user === this._cookieService.get('username')) {
              // console.log('if'+this.final[i].amount);
              this.owesMe = this.final[i];
              this.owesMeARR.push(this.owesMe);
            }else {
              // console.log('else'+this.final[i].first_user);
              this.IoweThem = this.final[i];
              this.IoweThemARR.push(this.IoweThem);
            }
          }
        },
        (error) => {
          console.log(error);
          // this.router.navigate(['login']);
        }
      );
    }
  }
  // Display data
  fun = (data) => {
    this.currentSelectedNum = data;
    this.currentSelected = this.owesMeARR[data];
    if (!this.addEx) {
      this.displayExpense = true;
    }
  }
  home()
  {
    this.router.navigate(['/usermain/screen/individual']);
  }
  redToProf(){
    this.router.navigate(['/usermain/profile']);
  }
  showExpSet = () => this.displayExpense = this.displayExpense ? false : true;
  editExpSet = () => { this.displayExpense = this.displayExpense ? false : true;
     this.editEx = this.editEx ? false : true; }
  editExpense() {
    let amount = '';
    let description = '';
    if (this.editExpForm.value.amount !== '') { amount = this.editExpForm.value.amt; }
    if (this.editExpForm.value.des !== '') { description = this.editExpForm.value.des; }
    const data = {
      first_user: this.currentSelected.first_user,
      second_user: this.currentSelected.second_user,
      amount: amount,
      gid: -1,
      id: this.currentSelected.id,
      description: description,
      settled_up: false
    };
    if (this.editExpForm.value.typeS === '1' || this.editExpForm.value.typeS === '2') {
      data.amount = (parseFloat(data.amount) / 2).toString();
    }
    if (this.editExpForm.value.typeS === '1' || this.editExpForm.value.typeS === '3') {
      data.first_user = data.second_user;
      data.second_user = this._cookieService.get('username');
    }
    const headers = new Headers({ 'Authorization': this._cookieService.get('token') });
    console.log(data);
    this.userService.editRecord(data, headers).subscribe(
      (editExpRes) => console.log(editExpRes),
      (editExpErr) => console.log(editExpErr)
    );
  }
  addPhotoSet = () => {
    this.addPhoto = this.addPhoto ? false : true;
  }
  fileEvent($event) {
    const fileSelected: File = $event.target.files[0];
    const headers = new Headers({ 'Authorization': this._cookieService.get('token') });
    this.userService.uploadFile(fileSelected , headers)
      .subscribe((sendPhotoResp) => {
        console.log(sendPhotoResp);
      },
      (sendPhotoErr) => {
        console.log('set any error actions...');
      });
  }
  createImageFromBlob(image: any) {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      this.imageToShow = reader.result;
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }
  getImage() {
    // const headers = new Headers({ 'Authorization': this._cookieService.get('token') });
    // this.userService.get(headers, this._cookieService.get('username') ).subscribe(
      // (getImgRes) => { console.log(getImgRes);
        // console.log('got image');
        // const a = getImgRes['_body'];
        // console.log(getImgRes['_body']);
        // console.log('finished');
        // const blob = new Blob([getImgRes['_body']], { type: 'image/png' });
        // const file = new File([blob], 'Anubhav.jpg');
        // saveAs(blob, 'Anubhav.jpg');
        // console.log('file printed');
        // this.createImageFromBlob(URL.createObjectURL(blob));
        // const objectURL = URL.createObjectURL(blob);
        // this.imageToShow = objectURL;
        // console.log(this.imageToShow);
        // console.log('over');
        // const b64Response = btoa(getImgRes['_body']);

        // create an image
        // const outputImg = document.createElement('img');
        // outputImg.src = 'data:image/png;base64,' + b64Response;

        // append it to your page
        // document.body.appendChild(outputImg);
        // this.isImageLoading = false;
     // },
      // (getImgErr) => console.log(getImgErr)
    // );
  }
}
// imageToShow: any;

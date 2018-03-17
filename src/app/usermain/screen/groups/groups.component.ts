import {
  Component, OnInit, ViewEncapsulation, Injectable, trigger, Inject,
  state, style, transition, animate, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';
import { NgForm, FormControl } from '@angular/forms';
import { GroupService } from './group.service';
import { UserService } from '../../user.service';
import { PageEvent } from '@angular/material';
import { MatTableDataSource } from '@angular/material';
import { element } from 'protractor';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import { MatChipInputEvent } from '@angular/material';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class GroupsComponent implements OnInit {
  showHist = false;
  myControl: FormControl;
  filteredUsers: Observable<any[]>;
  @ViewChild('f') form: NgForm;
  @ViewChild('createGroupForm') createGroupForm: NgForm;
  friendlist = [];
  friendlistB = [];
  requestedFriends = [];
  filteredfriends = this.friendlist;
  userGroups = [];
  users = [];
  records = [];
  selectedRecs = [];
  showAddFri = false;
  data = '';
  addGroupSettings = false;
  mouseOvered = {
    addGroup : false,
    groupSettings : false
  };
  groupSettings = {
    g_type : 'AP',
    name : '',
  };
  showGroupSettings = false;
  selectedGroup = [] ;
  selectedGroupDetails = {
    id : -1,
    g_type: 'AP',
    username: ''
  };
  selectedTab = {
    selectedRecord : true,
    selectedSettings : false,
    selectedActivity : false
  };
  selectedGroupIndex = 0;
  userData = [];
  loadingGroupDetails = false;
  userNameData = '';
  filteredGroups = this.userGroups;
  showGroupDetail = false;
  loading = false;
  color = 'warn';
  mode = 'indeterminate';
  visible = true;
  selectable = true;
  removable= true;
  addOnBlur = true;
  fruits = [];
  // Enter, comma
  separatorKeysCodes = [ENTER, COMMA];
  constructor(public _cookieService: CookieService, public groupService: GroupService, private router: Router,
    private userService: UserService, public dialog: MatDialog, private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.getUserData();
    this.getFriend();
    // console.log(this.groupService.getFriend(this._cookieService.get('username'), this._cookieService.get('token')));
    this.loading = true;
    const username = this._cookieService.get('username');
    const headers = new Headers({ 'Authorization': this._cookieService.get('token') });
    this.groupService.getGroups(username, headers).subscribe(
      (getGroupsResponse) => {
        for (const group of JSON.parse(getGroupsResponse['_body'])) {
          const g = group;
          this.userGroups.push(g);
        }
        this.loading = false;
        console.log(this.userGroups);
      },
      (error) => {
        console.log(error);
        // this.router.navigate(['login']);
      }
    );
  }
  getUserData() {
    const data = this._cookieService.get('username');
    const headers = new Headers({ 'Authorization': this._cookieService.get('token') });
    this.groupService.head(data, headers).subscribe(
      (getDataResponse) => {
        const serverData = JSON.parse(getDataResponse['_body']);
        for (const i of serverData) {
          if (i.gid !== '-1') {
            const record = {
              amt: 0,
              gid: -1,
              id: -1,
              timeCreated: '',
              lastUpdated: '',
              description: '',
              friend: '',
            };
            if (i.first_user === this.userNameData) {
              record.friend = i.second_user;
              record.amt = i.amount;
            } else {
              record.friend = i.first_user;
              record.amt = -1 * i.amount;
            }
            record.gid = i.gid;
            record.id = i.id;
            record.timeCreated = i.created;
            record.lastUpdated = i.last_changed;
            record.description = i.description;
            this.records.push(record);
          // for (const j of this.userData) {
          //   j.record.sort((a, b) => {
          //     if (a.gid < b.gid) {
          //       return -1;
          //     } else if (a.gid > b.gid) {
          //       return 1;
          //     } else {
          //       return 0;
          //     }
          //   });
          // }
        }
      }
    },
      (getDataError) => { console.log(getDataError); }
    );
  }
  deleteGroup() {
    const deleteGroupData = {
      gid: this.userGroups[this.selectedGroupIndex].id,
      username: this._cookieService.get('username')
      };
    const headers = new Headers({ 'Authorization': this._cookieService.get('token') });
    this.groupService.delGroup(deleteGroupData, headers).subscribe(
      (response) => {console.log(response);
      },
      (error) => console.log(error)
    );
  }
  inArray(needle) {
    const count = this.userData.length;
    for (let i = 0; i < count; i++) {
      if (this.userData[i].friend === needle) { return i; }
    }
    return -1;
  }
  showGroupHistory(id) {
    this.selectedGroupIndex = id;
    this.selectedGroupDetails.id = id;
    this.selectedGroupDetails.username = this.userGroups.filter(i => i.id === id)[0].username;
    this.selectedGroup = [];
    this.showGroupDetail = true;
    this.loadingGroupDetails = true;
    const headers = new Headers({ 'Authorization': this._cookieService.get('token') });
    this.groupService.getGroupMembers(id, headers).subscribe(
      (groupResponse) => {
        for (const iteratorGroup of JSON.parse(groupResponse['_body'])) {
          this.selectedGroup.push(iteratorGroup.member);
        }
        this.loadingGroupDetails = false;
        // this.cd.detectChanges();
      },
      (groupError) => { console.log(groupError); this.loadingGroupDetails = false; }
    );
    this.selectedRecs =  this.records.filter(item => +item.gid === id);
    console.log(this.selectedRecs);
  }
  getFriend() {
    this.data = this._cookieService.get('username');
    const headers = new Headers({ 'Authorization': this._cookieService.get('token') });
    this.groupService.getFriendList(this.data, headers).subscribe(
      (response3) => {
        // console.log(response3);
        const friendlist = JSON.parse(response3['_body']);
        // console.log(friendlist);
        for (const i of friendlist) {
          const det = {
            friend: '',
            accepted: false,
          };
          if (i.first_user === this.data) {
            det.friend = i.second_user;
            det.accepted = i.accepted_user1;
            if (det.accepted === false) {
              this.requestedFriends.push(det);
            }

          } else {
            det.friend = i.first_user;
            det.accepted = i.accepted_user2;
            if (det.accepted === false) {
              this.requestedFriends.push(det);
            }
          }
          this.friendlist.push(det);
        }
        this.filteredfriends = this.friendlist;
        this.copyFriend(this.friendlist);
        console.log(this.friendlist);
      },
      (error) => {
        console.log(error);
      }
    );
  }
  reset() {
    this.myControl.reset();
  }
  ngOnChanges() {
    this.myControl.reset();
  }
  filterUsers(name: string) {
    return this.users.filter(user =>
      user.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }
  applyFriendsFilter(filterValue: any , bool) {
    if (!filterValue && bool) {
      this.filteredfriends = this.friendlist;
    }
    this.filteredfriends = this.friendlist.filter(friendlist => friendlist.friend.indexOf(filterValue) >= 0);
    // filterValue = filterValue.trim(); // Remove whitespace
    // filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    // this.dataSource.filter = filterValue;
    // this.filteredusers=filterValue;
  }
  applyFilter(filterValue: any) {
    if (!filterValue) {
      this.filteredGroups = this.userGroups;
    }
    this.filteredGroups = this.userGroups.filter(userGroups => userGroups.name.indexOf(filterValue) >= 0);
    // filterValue = filterValue.trim(); // Remove whitespace
    // filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    // this.dataSource.filter = filterValue;
    // this.filteredusers=filterValue;
  }
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    const x = this.checkFriend(value.trim());
    // Add our fruit
    if ((value || '').trim() && x[0]) {
      this.fruits.push({ friend: value.trim(), accepted: x[1] });
      this.filteredfriends = this.filteredfriends.filter(item => item.friend !== value.trim());
      console.log(this.fruits);
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
  }
  addFriend(value) {
    const x = this.checkFriend(value.trim());
    if ((value || '').trim() && x[0]) {
      this.fruits.push({ friend: value.trim(), accepted: x[1] });
      this.filteredfriends = this.filteredfriends.filter(item => item.friend !== value.trim());
      this.friendlist = this.friendlist.filter(item => item.friend !== value.trim());
      console.log(this.fruits);
      this.applyFriendsFilter('', false);
    }
  }
  remove(fruit: any): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
      this.filteredfriends.push(fruit);
      this.friendlist.push(fruit);
    }
  }
  closeGroupDetails() {
    this.showGroupDetail = false;
    this.resetFriend(this.friendlistB);
    this.fruits = [];
    this.applyFriendsFilter('', false);
  }
  checkFriend(value) {
    for ( const i of this.filteredfriends) {
      if (i.friend === value) {
        return [true, i.accepted];
      }
    }
    return [false];
  }
  resetFriend(i) {
    this.friendlist = i;
  }
  copyFriend(i) {
    this.friendlistB = i;
  }
  tabChanged = (tabChangeEvent): void => {
    console.log('tabChangeEvent => ', tabChangeEvent);
    this.selectedTab.selectedSettings = false;
    console.log('index => ', tabChangeEvent.index);
    if (tabChangeEvent.index === 2 ) {
      this.selectedTab.selectedSettings = true;
    } else {
      this.selectedTab.selectedSettings = false;
    }
  }
  showAddFriend() {
    if ( !this.showAddFri) {
      this.resetFriend(this.friendlistB);
      for ( const i of this.selectedGroup) {
        this.filteredfriends = this.friendlist = this.friendlist.filter( item => i !== item.friend);
        console.log(i);
        console.log(this.friendlist);
      }
      this.showAddFri = true;
    }else {
      this.closeGroupDetails();
      this.showAddFri = false;
    }
  }
  addFriendToDataBase(i) {
    const headers = new Headers({ 'Authorization': this._cookieService.get('token') });
    return this.groupService.addFriendToGroup(i, headers).subscribe(
      (res) =>  res,
      (err) => err
    );
  }
  deleteFriendFromDataBase (i) {
    const headers = new Headers({ 'Authorization': this._cookieService.get('token')});
    this.groupService.deleteFriendFromGroup(i, headers).subscribe(
      (res) => console.log(res),
      (err) => console.log(err)
    );
  }
  call() {
    console.log(this.selectedGroupDetails);
  }
  createGroupFunc() {
    console.log(this.createGroupForm);
  }
  settle(id) {console.log('id=>', id);
    this.records = this.records.filter(i => i.id !== this.selectedRecs[id].id)
    this.selectedRecs = this.selectedRecs.filter(i => i.id !== this.selectedRecs[id].id);
  }
  selectedToggleChange(i) {
    console.log(i.value);
  }
  openDialog(name): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '350px',
      data: { name: name }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result === 'true') {
        this.deleteFriendFromDataBase(name);
      }
    });
  }

  openFriendsDialog() {
    this.dialog.closeAll();
    const addFriend = this.dialog.open(AddFriendsDialogComponent, {
      width: '350px',
      data: { friendlist: this.friendlistB, groupMembers : this.selectedGroup }
    });
    addFriend.afterClosed().subscribe(result => {
      if (result) {
        for (const i of result) {
          const data = {
            id : this.selectedGroupDetails.id,
            member : i.friend,
            adder : this._cookieService.get('username')
          };
          console.log(this.addFriendToDataBase(data));
          this.selectedGroup.push( i );
        }
      }
    });
  }

  createGroupDialog() {
    this.dialog.closeAll();
    const createGroup = this.dialog.open(CreateGroupDialogComponent, {
      width: '480px',
      data: { friendlist: this.friendlistB }
    });
    createGroup.afterClosed().subscribe(result => {
      const headers = new Headers({ 'Authorization': this._cookieService.get('token') });
      if (result) {
        this.groupService.AddGroup(
          {name: result.name, g_type: result.g_type, username: this._cookieService.get('username')},
        headers
        ).subscribe(
          (res) => {
            console.log(res);
            this.userGroups.push((JSON.parse(res['_body'])));
            for (const i of result.fruits) {
              const data = {
                id: JSON.parse(res['_body']).id,
                member: i.friend,
                adder: this._cookieService.get('username')
              };
              console.log(this.addFriendToDataBase(data));
              this.selectedGroup.push(i);
            }
          },
          (err) => console.log(err)
        );
      }
    });
  }
  addRecordDialog() {
    const dialogRef = this.dialog.open(AddRecordDialogComponent, {
      width: '400px',
      height: '400px',
      data: { gid: this.selectedGroupDetails.id }
    });
  }
}
@Component({
  template: `
  <h1 mat-dialog-title>Delete</h1>
    <mat-dialog-content>
      Do you want to remove {{data.name}} from the group?
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click) = "dialogRef.close('true')" >Yes</button>
      <button mat-button (click) = "dialogRef.close('false')" >No</button>
    </mat-dialog-actions>
  `,
})
export class DialogOverviewExampleDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

    onNoClick(): void {
      this.dialogRef.close();
    }

}
@Component({
  templateUrl: './addFriendsDialog.component.html',
})
export class AddFriendsDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<AddFriendsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
  friendlistB = this.data.friendlist;
  fruits = [];
  filteredfriends = [];
  friendlist = [];
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  startingLength = false;
  ngOnInit() {
    console.log(this.data.friendlist);
    for (const i of this.data.groupMembers) {
       this.friendlistB = this.friendlistB.filter(friendlist => friendlist.friend !== i);
    }
    this.resetFriend(this.friendlistB);
    console.log(this.friendlist);
    this.applyFriendsFilter('' , true);
    this.startingLength = this.friendlistB.length === 0 ? true : false;
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  applyFriendsFilter(filterValue: any, bool) {
    if (!filterValue && bool) {
      this.filteredfriends = this.friendlist;
    }
    this.filteredfriends = this.friendlist.filter(friendlist => friendlist.friend.indexOf(filterValue) >= 0);
    // filterValue = filterValue.trim(); // Remove whitespace
    // filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    // this.dataSource.filter = filterValue;
    // this.filteredusers=filterValue;
  }
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    const x = this.checkFriend(value.trim());
    // Add our fruit
    if ((value || '').trim() && x[0]) {
      this.fruits.push({ friend: value.trim(), accepted: x[1] });
      this.filteredfriends = this.filteredfriends.filter(item => item.friend !== value.trim());
      console.log(this.fruits);
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
  }
  addFriend(value) {
    const x = this.checkFriend(value.trim());
    if ((value || '').trim() && x[0]) {
      this.fruits.push({ friend: value.trim(), accepted: x[1] });
      this.filteredfriends = this.filteredfriends.filter(item => item.friend !== value.trim());
      this.friendlist = this.friendlist.filter(item => item.friend !== value.trim());
      console.log(this.fruits);
      this.applyFriendsFilter('', false);
    }
  }
  remove(fruit: any): void {
    console.log(fruit);
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
      this.filteredfriends.push(fruit);
      this.friendlist.push(fruit);
    }
  }
  closeGroupDetails() {
    this.resetFriend(this.friendlistB);
    this.fruits = [];
    this.applyFriendsFilter('', false);
  }
  checkFriend(value) {
    for (const i of this.filteredfriends) {
      if (i.friend === value) {
        return [true, i.accepted];
      }
    }
    return [false];
  }
  resetFriend(i) {
    this.friendlist = i;
  }

}
@Component({
  templateUrl: 'createGroup.component.html',
})
export class CreateGroupDialogComponent implements OnInit {
  isLinear = false;
  group_type = 'AP';
  @ViewChild('f') form: NgForm;
  @ViewChild('stepper') stepper;
  constructor(public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
     }
  friendlistB = this.data.friendlist;
  fruits = [];
  filteredfriends = [];
  friendlist = [];
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  startingLength = false;
  ngOnInit() {
    console.log(this.data.friendlist);
    this.resetFriend(this.friendlistB);
    console.log(this.friendlist);
    this.applyFriendsFilter('', true);
    this.startingLength = this.friendlistB.length === 0 ? true : false;
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  applyFriendsFilter(filterValue: any, bool) {
    if (!filterValue && bool) {
      this.filteredfriends = this.friendlist;
    }
    this.filteredfriends = this.friendlist.filter(friendlist => friendlist.friend.indexOf(filterValue) >= 0);
    // filterValue = filterValue.trim(); // Remove whitespace
    // filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    // this.dataSource.filter = filterValue;
    // this.filteredusers=filterValue;
  }
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    const x = this.checkFriend(value.trim());
    // Add our fruit
    if ((value || '').trim() && x[0]) {
      this.fruits.push({ friend: value.trim(), accepted: x[1] });
      this.filteredfriends = this.filteredfriends.filter(item => item.friend !== value.trim());
      console.log(this.fruits);
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
  }
  addFriend(value) {
    const x = this.checkFriend(value.trim());
    if ((value || '').trim() && x[0]) {
      this.fruits.push({ friend: value.trim(), accepted: x[1] });
      this.filteredfriends = this.filteredfriends.filter(item => item.friend !== value.trim());
      this.friendlist = this.friendlist.filter(item => item.friend !== value.trim());
      console.log(this.fruits);
      this.applyFriendsFilter('', false);
    }
  }
  remove(fruit: any): void {
    console.log(fruit);
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
      this.filteredfriends.push(fruit);
      this.friendlist.push(fruit);
    }
  }
  checkFriend(value) {
    for (const i of this.filteredfriends) {
      if (i.friend === value) {
        return [true, i.accepted];
      }
    }
    return [false];
  }
  resetFriend(i) {
    this.friendlist = i;
  }
  selectedToggleChange(i) {
    this.group_type = i.value;
  }
  func() {
    this.dialogRef.close({
      fruits : this.fruits,
      g_type : this.group_type,
      name: this.form.value.groupname
    });
  }
}
@Component({
  templateUrl: 'addRecord.component.html',
})
export class AddRecordDialogComponent implements OnInit {
  myControl: FormControl;
  filteredUsers: Observable<any[]>;
  NOT: any;
  @ViewChild('f') form: NgForm;
  username = '';
  addexpamt = '';
  tryAddExp = false;
  successAddExp = false;
  errAddExp = false;
  friendlist = [];
  requestedFriends = [];
  friendCard = false;
  filteredfriends = this.friendlist;
  data: any;
  // users: any[] = [
  //   {
  //     name: 'Rutvik',
  //     flag: './assets/images/img.jpg'
  //   },
  //   {
  //     name: 'Srijan',
  //     flag: 'assets/images/img2.png'
  //   }
  // ];
  users = [];
  color = 'warn';
  mode = 'indeterminate';
  constructor(public snackBar: MatSnackBar,
     public dialogRef: MatDialogRef<AddRecordDialogComponent>, @Inject(MAT_DIALOG_DATA) public dat: any,
    private userService: UserService, private router: Router, private _cookieService: CookieService) { }
  ngOnInit() {
    this.getFriendList();
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
  onSave() {
    const data = {
      first_user: '',
      second_user: '',
      description: '',
      gid: this.dat.gid,
      amount: 0,
      split_type: 100,
      settled_up: false
    };
    data.amount = this.form.value.amount;
    data.description = this.form.value.descrip;
    if (this.form.value.nature === '2' || this.form.value.nature === '3') {
      data.second_user = this.form.value.usernam;
      data.first_user = this._cookieService.get('username');
    } else {
      data.first_user = this.form.value.usernam;
      data.second_user = this._cookieService.get('username');
    }
    if (this.form.value.nature === '4' || this.form.value.nature === '3') {
      data.split_type = 50;
    }
    // console.log(data);
    const headers = new Headers({ 'Authorization': this._cookieService.get('token') });
    this.tryAddExp = true;
    this.userService.addRecord(data, headers).subscribe(
      (addRecRes) => { // console.log(addRecRes); 
        const id = JSON.stringify(addRecRes).split(':')[6].split(',')[0];
        const notifs = {
          receiver: '',
          doer: this._cookieService.get('username'),
          record: id,
          body: 'CRR',
          description: ''
        };
        if (data.first_user = this._cookieService.get('username')) {
          notifs.receiver = data.second_user;
          notifs.description = notifs.doer + ' added a record with you';
        }
        // this.openSnackBar("Successfully added the record",'');
        else {
          notifs.receiver = data.first_user;
          notifs.description = notifs.doer + ' added a record with you';
        }
        this.userService.addRecAct(notifs, headers).subscribe(
          (succ) => {
            console.log(succ);
          },
          (err) => {
            console.log(err);
          }
        );
        this.tryAddExp = false; this.successAddExp = true; this.errAddExp = false;
        this.openSnackBar("Successfully added the record", '');
        this.form.reset();
      },
      (addRecErr) => {
        console.log(addRecErr);
        this.tryAddExp = false;
        this.successAddExp = false;
        this.errAddExp = true;
        this.openSnackBar("Error adding record", 'Fill in all the fields.');
      }
    );
  }
  return() {
    this.tryAddExp = false; this.successAddExp = false; this.errAddExp = false;
  }
  filterUsers(name: string) {
    return this.users.filter(user =>
      user.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }
  // filterFriends(name: string) {
  //   return this..filter(user =>
  //     user.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
  // }
  // openSnackBar(message: string, action: string) {
  //   this.snackBar.open(message, action, {
  //     duration: 2000,
  //   });
  // }
  reset() {
    this.myControl.reset();
  }
  resetForm() {
    this.form.reset();
  }
  getFriendList() {
    this.data = this._cookieService.get('username');
    const headers = new Headers({ 'Authorization': this._cookieService.get('token') });
    this.userService.getFriendList(this.data, headers).subscribe(
      (response3) => {
        // console.log(response3);
        const friendlist = JSON.parse(response3['_body']);
        // console.log(friendlist);
        for (const i of friendlist) {
          const det = {
            name: '',
            accepted: false,
          };
          if (i.first_user === this.data) {
            det.name = i.second_user;
            det.accepted = i.accepted_user1;
            if (det.accepted === false) {
              this.requestedFriends.push(det);
            }

          } else {
            det.name = i.first_user;
            det.accepted = i.accepted_user2;
            if (det.accepted === false) {
              this.requestedFriends.push(det);
            }
          }
          this.users.push(det);
          console.log(this.users);
        }
        this.myControl = new FormControl();
        this.filteredUsers = this.myControl.valueChanges
          .startWith(null)
          .map(user => user ? this.filterUsers(user) : this.users.slice());
      },
      (error) => {
        console.log(error);
      }
    );
  }
  // applyFriendsFilter(filterValue: any) {
  //   if (!filterValue) {
  //     this.filteredfriends = this.friendlist;
  //   }
  //   this.filteredfriends = this.friendlist.filter(friendlist => friendlist.friend.indexOf(filterValue) >= 0);
  //   // filterValue = filterValue.trim(); // Remove whitespace
  //   // filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
  //   // this.dataSource.filter = filterValue;
  //   // this.filteredusers=filterValue;
  // }
}

import {
  Component, OnInit, ViewEncapsulation, Injectable, trigger,
  state, style, transition, animate, ViewChild, Inject } from '@angular/core';
import { PageEvent } from '@angular/material';
import {MatTableDataSource} from '@angular/material';
import { CookieService } from 'ngx-cookie';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UserService } from '../usermain/user.service';
import { element } from 'protractor';
import { DataSource } from '@angular/cdk/collections';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { DatePipe } from '@angular/common';



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
  loadingrec = false;
  count = 0;
  referenceLines = [];
  dateref: any;
  mode = 'indeterminate';
  @ViewChild('f') form: NgForm;
  loading = false;
  showingExp = false;
  showHist = false;
  data: any;
  showExpense = [];
  editExp = false;
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
  name = '';
  pageSizeOptions = [5, 10, 25, 100];
  pageEvent: PageEvent;
  rec = false;
  public lineChartData: any =  {
    chartType: 'LineChart',
    dataTable: [],
    //   ['Date', 'Sales', 'Expenses'],
    //   ['2004',  1000,      400],
    //   ['2005',  1170,      460],
    //   ['2006',  660,       1120],
    //   ['2007',  1030,      540]
    // ],
    options: {title: 'Company Performance'}
  };




  single = [];
  //   {
  //     "name": "Germany",
  //     "value": 8940000
  //   },
  //   {
  //     "name": "USA",
  //     "value": 5000000
  //   },
  //   {
  //     "name": "France",
  //     "value": 7200000
  //   }
  // ];

multi = [];
day = 86400000;
  //   {
  //     "name": "Germany",
  //     "series": [
  //       {
  //         "name": "2010",
  //         "value": 7300000
  //       },
  //       {
  //         "name": "2011",
  //         "value": 8940000
  //       }
  //     ]
  //   },
  //   {
  //     "name": "USA",
  //     "series": [
  //       {
  //         "name": "2010",
  //         "value": 7870000
  //       },
  //       {
  //         "name": "2011",
  //         "value": 8270000
  //       }
  //     ]
  //   },
  //   {
  //     "name": "France",
  //     "series": [
  //       {
  //         "name": "2010",
  //         "value": 5000002
  //       },
  //       {
  //         "name": "2011",
  //         "value": 5800000
  //       },
  //       {
  //         "name": "2012",
  //         "value": 5800000
  //       }
  //     ]
  //   }
  // ];

  view1: any[] = [600, 300];
  view2: any[] = [600, 300];
  timeline = true;
  view: any[] = [400, 200];
  showRefLines = true;
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = false;
  xAxisLabel = 'date';
  showYAxisLabel = false;
  yAxisLabel = ' expenditure ';

  colorScheme = {
    domain: ['N/A', '#5AA454', '#A10A28', '#C7B42C', '#AAAAAA', '#f44336', '#ad1457', '#0d47a1', '#311b92', '#00b8d4']
  };

  // line, area
  autoScale = true;


  selectedExpense = {
    amt: 0,
    gid: -1,
    id: -1,
    timeCreated: '',
    lastUpdated: '',
    description: '',
    settled_up: false
  };
  selectedUser = {
    friend: '',
    name: '',
    record: [],
    netamt: 0,
    rec: ''
  };
dash = [
    {
      'name': 'You Owe',
      'value' : 0
    },
    {
      'name' : 'Net Total',
      'value' : 0
    },
    {
      'name' : 'You are Owed',
      'value' : 0
    }
  ];
  colorSchemed = {
    domain: ['#A10A28', '#C7B42C', '#5AA454']
  };
  dview = [, 100];
  barPadding = 9;
  roundDomains = true;
  friendlist = [];
  show = 3;
  j = 0;
  friendCard = false;
  editRecord = false;
  constructor( private datePipe: DatePipe, public dialog: MatDialog, private cd: ChangeDetectorRef,
    public _cookieService: CookieService, private userService: UserService, private router: Router) {
   }

  panelOpenState = false;

  users: any[];


  lent= 0;
  owed = 0;
  totExp = 0;
  addexpamt = '';
  NOT = '';
  usernam = '';


  filteredusers = this.userData;
  filteredfriends = this.friendlist;
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
      this.userService.getFriendList(this.data, headers).subscribe(
        (response3) => {
            // console.log(response3);
            const friendlist = JSON.parse(response3['_body']);
            for (const i of friendlist){
              const det = {
                friend : ''
              };
              if (i.first_user === this.data) {
                det.friend = i.second_user;
              } else {
                det.friend = i.first_user;
              }
              this.friendlist.push(det);
            }
            // console.log(this.friendlist);
        },
        (error) => {
          console.log(error);
        }
      );
      // this.userService.head(this.data, headers).subscribe(
      //   (getDataResponse) => {
      //     console.log(getDataResponse);
      //     const serverData = JSON.parse(getDataResponse['_body']);
      //     this.lineChartData.dataTable.push(['Date','Expenditure']);
      //     for (const i of serverData) {
      //       const record = {
      //         amt: 0,
      //         gid: -1,
      //         id: -1,
      //         timeCreated: '',
      //         lastUpdated: '',
      //         description: '',
      //         split_type: 100,
      //         settled_up: false
      //       };
      //       const data = {
      //         friend: '',
      //         name: '',
      //         record: [],
      //         netamt: 0,
      //         rec: ''
      //       };
      //       let amt = 0;
      //       if (i.first_user === this.data) {
      //         data.friend = i.second_user;
      //         amt = i.amount;
      //       } else {
      //         data.friend = i.first_user;
      //         amt = -1 * i.amount;
      //       }
      //       record.amt = amt;
      //       record.gid = i.gid;
      //       record.id = i.id;
      //       record.timeCreated = i.created;
      //       record.lastUpdated = i.last_changed;
      //       record.description = i.description;
      //       const index = this.inArray(data.friend);
      //       if (index === -1) {
      //         data.netamt = amt;
      //         if (data.netamt < 0) {
      //           data.rec = 'You owe ' + data.friend + ' ';
      //         }else {
      //           data.rec = 'He owes you ' ;
      //         }
      //         data.record.push(record);
      //         this.userData.push(data);
      //         this.users.push({
      //           name: data.friend,
      //           dues: data.netamt.toString()
      //         });
      //       } else {
      //         this.userData[index].netamt += record.amt;
      //         this.userData[index].record.push(record);
      //       }
      //       if(this.j<=5) {
      //         this.j+=1;
      //         //console.log(record.timeCreated);
      //         const time = record.timeCreated.substring(0,10); 
      //         this.lineChartData.dataTable.push([time, record.amt]);
      //       }
      //     }
      //     console.log(this.userData.reverse());
      //     console.log(this.userData);
      //     for (const i of this.userData.reverse()) {
      //       const det = {
      //         name : '',
      //         value : 0,
      //       };
      //       const det1 = {
      //         name : i.friend,
      //         series : []
      //       };
      //       for( const j of i.record.reverse()){
      //         const records = {
      //           name : j.timeCreated.substring(0,10),
      //           value : +j.amt
      //         };
      //         det1.series.push(records);
      //       }
      //       console.log(det1.name);
      //       this.multi.push(det1);
      //       det.value= +i.netamt;
      //       det.name=i.friend;
      //       this.single.push(det);

      //       i.record.sort((a, b) => {
      //         if (a.id < b.id) {
      //           return -1;
      //         } else if (a.id > b.id) {
      //           return 1;
      //         } else {
      //           return 0;
      //         }
      //       });
      //     }
      //     for (const dat of this.userData) {
      //       console.log(dat.record);
      //       const a = new MatTableDataSource(dat.record);
      //       this.dataSource.push(a);
      //     }
      //     console.log(this.dataSource);
      //     this.loading = false;
      //   },
      //   (getDataError) => { console.log(getDataError); this.loading = false; }
      // );
      this.getRecords();
    }
  }
  getRecords() {
    this.loading = true;
    this.multi = [];
    this.count = 0;
    this.lent = 0;
    this.owed = 0;
    this.totExp = 0;
    this.single = [];
    const detref = {
      name : 'Reference',
      series : []
    };
    let z = 6;
    while ( z >= 0) {
      const myDate = Date.now();
      this.dateref = this.datePipe.transform(myDate - this.day * z, 'yyyy-MM-dd');
      console.log(this.dateref);
      const record = {
        name : this.dateref,
        value : 0
      };
      this.referenceLines.push(record);
      detref.series.push(record);
      z -= 1;
    }
    this.multi.push(detref);
    const headers = new Headers({ 'Authorization': this._cookieService.get('token') });
    this.userService.head(this.data, headers).subscribe(
      (getDataResponse) => {
        console.log(getDataResponse);
        const serverData = JSON.parse(getDataResponse['_body']);
        this.lineChartData.dataTable.push(['Date', 'Expenditure']);
        for (const i of serverData) {
          console.log(i.split_type);
          if (i.first_user !== i.second_user && i.split_type > 5) {
          const record = {
            amt: 0,
            gid: -1,
            id: -1,
            timeCreated: '',
            lastUpdated: '',
            description: '',
            split_type: 100,
            settled_up: false
          };
          const data = {
            friend: '',
            name: '',
            record: [],
            netamt: 0,
            rec: ''
          };
          let amt = 0;
          if (i.first_user === this.data) {
            data.friend = i.second_user;
            amt = i.amount;
            this.lent += amt;
          } else {
            data.friend = i.first_user;
            amt = -1 * i.amount;
            this.owed += amt;
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
            this.totExp += data.netamt;
            if (data.netamt < 0) {
              data.rec = 'You owe ' + data.friend + ' ';
            }else {
              data.rec = 'He owes you ' ;
            }
            data.record.push(record);
            this.userData.push(data);
            // this.users.push({
            //   name: data.friend,
            //   dues: data.netamt.toString()
            // });
          } else {
            this.userData[index].netamt += record.amt;
            this.totExp += record.amt;
            this.userData[index].record.push(record);
          }
        }
        console.log(this.totExp);
        console.log(this.userData.reverse());
        console.log(this.userData);
        for (const i of this.userData) {
          const det = {
            name : '',
            value : 0,
          };
          const det1 = {
            name : i.friend,
            series : []
          };
          const myDate = Date.now();
          this.dateref = this.datePipe.transform(myDate - this.day * 7, 'yyyy-MM-dd');
          const lastDate = this.dateref.substring(8, 10);
          console.log(lastDate);
          console.log('NEW');
          for ( const j of i.record.reverse()){
            console.log(j.timeCreated.substring(0, 10));
            const records = {
              name : j.timeCreated.substring(0, 10),
              value : +j.amt
            };
            if (records.name.substring(8, 10) > lastDate) {
              det1.series.push(records);
            }
          }
          // console.log(det1.name);
          // if(this.count<=5) {
            this.count += 1;
            this.multi.push(det1);
          // }
          if (+i.netamt < 0) {
            det.value = -1 * (+i.netamt);
          } else{
            det.value = +i.netamt;
          }
          det.name = i.friend;
          this.single.push(det);

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
        this.loadingrec = false;
        this.filteredusers = this.userData;
        // this.cd.detectChanges();
        this.dash[0].value = + this.owed;
        this.dash[1].value = + this.totExp;
        this.dash[2].value = + this.lent;
      }
      },
      (getDataError) => { console.log(getDataError); this.loading = false; }
    );
  }
  inArray(needle) {
    const count = this.userData.length;
    for (let i = 0; i < count; i++) {
      if (this.userData[i].friend === needle) { return i; }
    }
    return -1;
  }
  prompt = false;
  showPrompt() {
    this.prompt = true;
  }
  closePrompt() {
    this.prompt = false;
  }
  con = false;
  confirm() {
    this.con = true;
  }
  lulu = false;
  settle(i) {
    this.loadingrec = true;
    this.lulu = true;
    const det = {
      amount: this.selectedUser.record[i].amount,
      first_user: this._cookieService.get('username'),
      second_user: this.selectedUser.friend,
      gid : '-1',
      id : this.selectedUser.record[i].id,
      settled_up: true,
      split_type : this.selectedUser.record[i].split_type
    };
    const headers = new Headers({ 'Authorization': this._cookieService.get('token') });
    this.userService.editRecord(det, headers).subscribe(
      (editRecRes) => {
        this.selectedUser.record = this.selectedUser.record.filter(i => i.id !== det.id);
        this.userData = [];
        this.filteredusers = [];
        this.getRecords();
        this.cd.detectChanges();
        this.lulu = false;
        console.log(editRecRes);
      },
      (editRecErr) => console.log(editRecErr)
    );

  }
  closeaf() {
    this.friendCard = false;
  }
  closerec() {
    this.loadingrec = true;
    this.displayI = false;
    this.selectedUser.record = [];
    this.userData = [];
    this.filteredusers = [];
    this.getRecords();
    // this.cd.detectChanges();
  }
  showAddFriend() {
    this.friendCard = true;
  }
  showExp(i) {
    this.selectedExpense = this.selectedUser.record[i];
    this.showingExp = true;
  }
  chart = false;
  chartOn() {
    this.chart = true;
    this.lchart = false;
  }
  lchart = true;
  lchartOn(){
    this.lchart = true;
    this.chart = false;
  }
  chartOff(){
    this.chart = false;
  }
  showHistory(index) {
    this.showHist = true;
    this.selectedUser = this.userData[index];
    console.log(this.selectedUser.friend);
  }
  closeRec() {
    this.showHist = false;
  }
  closeExp() {
    this.showingExp = false;
  }
  editExpense() {
    this.editExp = this.editExp ? false : true;
  }
  onSave() {
    const headers = new Headers({ 'Authorization': this._cookieService.get('token') });
    console.log(this.form.value);
    const f = this.form.value;
    const data = {
      first_user: '',
      second_user: '',
      description: '',
      gid: -1,
      id: this.selectedExpense.id,
      amount: 0,
      settled_up: false
    };
    if (f.amount === undefined) {
      data.amount = this.selectedExpense.amt;
    } else {
      data.amount = f.amount;
    }
    if (f.descrip === '') {
      data.description = this.selectedExpense.description;
    } else {
      data.description = f.descrip;
    }
    if (data.amount > 0) {
      data.first_user = this._cookieService.get('username');
      data.second_user = this.selectedUser.friend;
    } else {
      data.first_user = this.selectedUser.friend;
        data.second_user =  this._cookieService.get('username');
    }
    this.userService.editRecord(data, headers).subscribe(
      (editRecRes) => console.log(editRecRes),
      (editRecErr) => console.log(editRecErr)
    );
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
  applyFriendsFilter(filterValue: any) {
    if (!filterValue) {
      this.filteredfriends = this.friendlist;
    }
      this.filteredfriends = this.friendlist.filter(friendlist => friendlist.friend.indexOf(filterValue) >= 0);
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
  openDialog(): void {
    const dialogRef = this.dialog.open(AddRecordComponent, {
      width: '400px',
      height: '400px',
      data: { name: this.name}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadingrec = true;
      this.displayI = false;
      this.selectedUser.record = [];
      this.userData = [];
      this.filteredusers = [];
      this.getRecords();
      console.log('The dialog was closed');
    });
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
@Component({
  templateUrl:'./addRecord.component.html',
})
export class AddRecordComponent {
  constructor(
    public dialogRef: MatDialogRef<AddRecordComponent>, @Inject(MAT_DIALOG_DATA) public data: any
  ) { }
}

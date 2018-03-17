import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {Routes, RouterModule} from '@angular/router';
import { CookieModule } from 'ngx-cookie';


import { DialogOverviewExampleDialog, AddFriendsDialogComponent,
  CreateGroupDialogComponent } from './usermain/screen/groups/groups.component';
import { MaterializeModule } from 'angular2-materialize';
import { AppComponent } from './app.component';
import { ServerService } from './login/server.service';
import { UserService } from './usermain/user.service';
import { LoginComponent } from './login/login.component';
import { SignService } from './signup/sign.service';
import { SignupComponent } from './signup/signup.component';
import { MainComponent } from './main/main.component';
import { UsermainComponent, friendBoxComponent } from './usermain/usermain.component';
import { ProfileComponent } from './usermain/profile/profile.component';
import { ScreenComponent } from './usermain/screen/screen.component';
import { RecentActionsComponent } from './usermain/screen/recent-actions/recent-actions.component';
import { IndividualComponent } from './usermain/screen/individual/individual.component';
import { GroupsComponent } from './usermain/screen/groups/groups.component';
import { MaterialModule } from './material.module';
import { UpperCardComponent } from './upper-card/upper-card.component';
import { TablesComponent, AddRecordComponent } from './tables/tables.component';
import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { AddFriendsComponent } from './add-friends/add-friends.component';
import { ProfileService } from './usermain/profile/profile.service';
import { GroupService } from './usermain/screen/groups/group.service';
import { ScrollbarModule } from 'ngx-scrollbar';
import { FriendlistComponent } from './friendlist/friendlist.component';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import { NotificationsComponent } from './notifications/notifications.component';
import { DatePipe } from '@angular/common';
import { MessagesComponent } from './messages/messages.component';
import { PersonalComponent } from './personal/personal.component';
import { ActivityComponent } from './activity/activity.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { AddRecordDialogComponent } from './usermain/screen/groups/groups.component';
import { ServerComponent } from './server/server.component';
const appRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'main',
    component: MainComponent
  },
  {
    path: 'usermain',
    component: UsermainComponent,
    children: [
      {
        path: 'screen',
        component: ScreenComponent,
        children: [
          {
            path: 'personal',
            component: PersonalComponent
          },
          {
            path: 'individual',
            component: IndividualComponent
          },
          {
            path: 'group',
            component: GroupsComponent
          },
          {
            path: 'recent',
            component: RecentActionsComponent,
          }
        ]
      },
      {
        path: 'profile',
        component: ProfileComponent
      }
    ]
  }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    MainComponent,
    UsermainComponent,
    ProfileComponent,
    ScreenComponent,
    RecentActionsComponent,
    IndividualComponent,
    GroupsComponent,
    UpperCardComponent,
    TablesComponent,
    AutocompleteComponent,
    AddFriendsComponent,
    FriendlistComponent,
    NotificationsComponent,
    AddRecordComponent,
    friendBoxComponent,
    MessagesComponent,
    DialogOverviewExampleDialog, AddFriendsDialogComponent,
  CreateGroupDialogComponent,
  PersonalComponent, ActivityComponent,
    SidenavComponent, AddRecordDialogComponent,
    ServerComponent

  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes, { useHash: true }),
    CookieModule.forRoot(),
    MaterialModule,
    BrowserAnimationsModule,
    ScrollbarModule,    NgxChartsModule
  ],
  providers: [ServerService, SignService, UserService, ProfileService, GroupService,DatePipe],
  bootstrap: [AppComponent],  
  entryComponents: [AddRecordComponent,friendBoxComponent,  DialogOverviewExampleDialog, AddFriendsDialogComponent,
    CreateGroupDialogComponent]
})
export class AppModule { }

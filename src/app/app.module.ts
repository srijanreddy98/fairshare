import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {Routes, RouterModule} from '@angular/router';

import { CookieModule } from 'ngx-cookie';

import { AppComponent } from './app.component';
import { ServerService } from './login/server.service';
import { UserService } from './usermain/user.service';
import { LoginComponent } from './login/login.component';
import { SignService } from './signup/sign.service';
import { SignupComponent } from './signup/signup.component';
import { MainComponent } from './main/main.component';
import { UsermainComponent } from './usermain/usermain.component';

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
    component: UsermainComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    MainComponent,
    UsermainComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes, { useHash: true }),
    CookieModule.forRoot()
  ],
  providers: [ServerService, SignService, UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }

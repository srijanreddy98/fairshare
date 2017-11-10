import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class SignService {
    constructor(private http: Http) {}
        sendSignUpData(data: any) {
            return this.http.post('https://fairshare2017.herokuapp.com/authen/adduser/', data);
        }
}

import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

@Injectable()
export class ServerService {
    constructor(private http: Http) {}
        sendSignUpData(data: any) {
            return this.http.post('https://fairshareapp2.herokuapp.com/api-token-auth/', data);
        }
}

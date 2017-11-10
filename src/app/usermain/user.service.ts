import { Injectable } from '@angular/core';
import { Http , Headers } from '@angular/http';

@Injectable()
export class UserService {
    url = 'https://fairshareapp2.herokuapp.com/';
    constructor(private http: Http) {}
    head(data: any, headers: any) {
        return this.http.get(this.url + 'records/recordhistorylist/' + '?username=' + data, { headers: headers });
    }
    addRecord(data: any, headers: any) {
        return this.http.post(this.url + 'records/recordhistorylist/', data, { headers: headers });
    }
}

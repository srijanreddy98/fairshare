import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

@Injectable()
export class ProfileService {
    constructor(private http: Http) { }
    getFriendRequests(data: any, headers: any) {
        return this.http.get('https://fairshareapp2.herokuapp.com/friend/friendlist?username=' + data.username, { headers: headers });
    }
    getUserProfile(data: any, headers: any) {
        return this.http.get('https://fairshareapp2.herokuapp.com//authen/getuser', { headers: headers });
    }
}

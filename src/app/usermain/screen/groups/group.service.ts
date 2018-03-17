import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import { FormControl } from '@angular/forms';

@Injectable()
export class GroupService {
    constructor(private http: Http) { }
    getGroups(data: any, headers: any) {
        return this.http.get('https://fairshareapp2.herokuapp.com/groups/grouplist/' + '?username=' + data, { headers: headers });
    }
    AddGroup(data: any, headers: any) {
        return this.http.post('https://fairshareapp2.herokuapp.com/groups/grouplist/', data, { headers: headers });
    }
    delGroup(data: any, headers: any) {
        return this.http.delete('https://fairshareapp2.herokuapp.com/groups/groupdetail/', { headers: headers, body: data });
    }
    getGroupMembers(data: any, headers: any) {
        return this.http.get('https://fairshareapp2.herokuapp.com/groups/groupmemberlist/' + '?gid=' + data, { headers: headers });
    }
    getFriendList(data: any, headers: any) {
        return this.http.get('https://fairshareapp2.herokuapp.com/friend/friendlist/' + '?username=' + data, { headers: headers });
    }
    addFriendToGroup(data , headers) {
        return this.http.post('https://fairshareapp2.herokuapp.com/groups/groupmemberlist/', data , {headers: headers});
    }
    deleteFriendFromGroup(data, headers) {
        return this.http.delete('https://fairshareapp2.herokuapp.com/groups/groupmemberlist/', { headers: headers, body : data });
    }
    head(data: any, headers: any) {
        return this.http.get('https://fairshareapp2.herokuapp.com/' + 'records/recordhistoryfulldatalist/'
         + '?username=' + data, { headers: headers });
    }
}

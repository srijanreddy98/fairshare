import { Injectable } from '@angular/core';
import { Http, Headers, ResponseContentType, RequestOptions, RequestMethod, Request} from '@angular/http';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import 'rxjs/add/operator/map' ;

@Injectable()
export class UserService {
    url = 'https://fairshareapp2.herokuapp.com/';
    constructor(private http: Http, private sanitizer: DomSanitizer) {}
    head(data: any, headers: any) {
        console.log('hey');
        console.log(headers);
        return this.http.get(this.url + 'records/recordhistoryfulldatalist/' + '?username=' + data, { headers: headers });
    }
    addRecord(data: any, headers: any) {
        return this.http.post(this.url + 'records/recordhistorylist/', data, { headers: headers });
    }
    editRecord(data: any, headers: any) {
        return this.http.put(this.url + 'records/recordhistorylist/', data, { headers: headers });
    }
    uploadFile(fileToUpload: File, headers: any) {
        const _formData = new FormData();
        _formData.append('avatar', fileToUpload, fileToUpload.name);
        return <any>this.http.put(this.url + 'authen/changeavatar/', _formData, { headers: headers });
    }
     get(headers, data) {
         return this.http.get(this.url + 'authen/getavatar/', { headers: headers});
    }
    // getImage(imageUrl: string, headers: any): Observable<File> {
    //     return this.http
    //         .get(imageUrl, { headers: headers, responseType: ResponseContentType.Blob })
    //         .map((res: Response) => res.blob());
    // }
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
        return this.http.get('https://fairshareapp2.herokuapp.com/friend/friendlist/' + '?username=' + data, {headers: headers});
    }
    addFriend(data: any, headers: any) {
        return this.http.post(this.url + 'friend/friendlist/', data, { headers: headers } );
    }
    acceptRequest(data: any, headers: any) {
        return this.http.put(this.url + 'friend/friendlist/', data, { headers: headers} );
    }
}

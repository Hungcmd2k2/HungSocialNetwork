import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../Config/environment';

@Injectable({
  providedIn: 'root'
})
export class FollowService {
  private url =environment.apiUrl;
  private apiUrl = this.url + '/api';



  constructor(private http: HttpClient) { }
  //hàm check xem đã folow người đó chưa
  checkFollow(request:any):Observable<any> {
    return this.http.post(`${this.apiUrl}/checkFollow`, request,{observe:'response'}).pipe(
      map((response) => response.body)
    );
  }
 //hàm gọi follow
 Follow(request:any):Observable<any> {
  return this.http.post(`${this.apiUrl}/follow`, request,{observe:'response'}).pipe(
    map((response) => response.body)
  );
    }

    //hàm gọi unfolow
    UnFollow(request:any):Observable<any> {
      return this.http.post(`${this.apiUrl}/unfollow`, request,{observe:'response'}).pipe(
        map((response) => response.body)
      );
        }

  //Hàm lấy về danh sách mà mình đang  follow
  List_Following(followerId:any):Observable<any> {
    return this.http.get(`${this.apiUrl}/followingWho/${followerId}`,{observe:'response'}).pipe(
      map((response) => response.body)
    );
      }

      //Hàm lấy về danh sách mà mình đang  follow
  List_Followers(followingId:any):Observable<any> {
    return this.http.get(`${this.apiUrl}/followers/${followingId}`,{observe:'response'}).pipe(
      map((response) => response.body)
    );
      }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FollowService {

  private apiUrl = 'http://localhost:8080/api';

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
}

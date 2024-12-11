import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../Config/environment';

@Injectable({
  providedIn: 'root'
})
export class LikeService {
  private url =environment.apiUrl;
  private apiUrl = this.url + '/api/like';


  constructor(private http: HttpClient) { }

  //hàm gọi like
 Like(request:any):Observable<any> {
  return this.http.post(`${this.apiUrl}/create`, request,{observe:'response'}).pipe(
    map((response) => response.body)
  );
    }

    //Hàm unlike
    UnLike(request:any):Observable<any> {
      return this.http.post(`${this.apiUrl}/delete`, request,{observe:'response'}).pipe(
        map((response) => response.body)
      );
        }

    //Hàm check xem đã like chưa
    isLike(request:any):Observable<any> {
      return this.http.post(`${this.apiUrl}/isLiked`, request,{observe:'response'}).pipe(
        map((response) => response.body)
      );
        }
    //Đếm số lượt like
   totalLike(postId:number):Observable<any> {
      return this.http.get(`${this.apiUrl}/total/${postId}`,{observe:'response'}).pipe(
        map((response) => response.body)
      );
      }
}

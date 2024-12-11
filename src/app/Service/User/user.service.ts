import { ApiResponseBody } from './../../interFace/ApiResponseBody';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../Config/environment';


// Model cho User
interface User {
  id: number;
  email: string;
  fullname: string;
  password: string;
}
// Model cho Search User

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url =environment.apiUrl;
  private apiUrl = this.url + '/api/users';


  constructor(private http: HttpClient) { }

  // Hàm tìm user theo email
  getUserByEmail(email: string): Observable<HttpResponse<any>> {
    return this.http.get<User>(`${this.apiUrl}/email/${email}`,{observe:'response'});
  }
  // Hàm tìm user theo username
  getUserByUsername(username: string): Observable<HttpResponse<any>> {
    return this.http.get<User>(`${this.apiUrl}/username/${username}`,{observe:'response'});
  }
  // Hàm tìm user theo userId
  getUserById(userId:number):Observable<any> {
    return this.http.get(`${this.apiUrl}/${userId}`,{observe:'response'}).pipe(
      map((response) => response.body)
    );
  }

  // Hàm tìm user theo ký tự
  searchUser(keyword: string): Observable<ApiResponseBody | null> {
    return this.http
      .get<ApiResponseBody>(`${this.apiUrl}/search/${keyword}`, { observe: 'response' })
      .pipe(map((response) => response.body || null));
  }

  //Hàm thêm mới User
  createUser(user: any): Observable<HttpResponse<any>> {
    return this.http.post(this.apiUrl, user,{observe:'response'});
  }
  //Thêm mới dữ liệu cho userdetail
  updateUserdetail(user:any):Observable<HttpResponse<any>> {
    return this.http.put(`${this.apiUrl}/details/update`, user,{observe:'response'});
  }
  //Hàm lấy thông tin chi tiết về userdetail
  getUserdetail(userid:number): Observable<any> {
    return this.http.get<HttpResponse<any>>(`${this.apiUrl}/details/${userid}`, { observe: 'response' }).pipe(
      map((response) => response.body)
    );
  }
 // Hàm thay đổi password
 updatePassword(user:any):Observable<any> {
  return this.http.put(`${this.apiUrl}/update_Password`, user,{observe:'response'}).pipe(
    map((response) => response.body)
  );
}
//Hàm lấy thông tin về trang cá nhân của người dùng khác
getUserOther(username:string): Observable<any> {
  return this.http.get<HttpResponse<any>>(`${this.apiUrl}/userOther/${username}`, { observe: 'response' }).pipe(
    map((response) => response.body)
  );
}
}

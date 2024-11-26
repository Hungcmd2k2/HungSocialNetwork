import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';


interface User {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }
  private apiUrl = 'http://localhost:8080/auth';

  callApiLogin(user: any): Observable<HttpResponse<any>> {
    return this.http.post(`${this.apiUrl}/login`, user,{observe:'response'});
  }

  //Hàm check mật khẩu hiện tại để đổi mật khẩu
  checkPassword(user:any): Observable<any> {
    return this.http.post<HttpResponse<any>>(`${this.apiUrl}/checkpassword`,user, { observe: 'response' }).pipe(
      map((response) => response.body)
    );
  }
}

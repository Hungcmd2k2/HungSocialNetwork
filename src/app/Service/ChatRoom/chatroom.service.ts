import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../Config/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatroomService {
  private url =environment.apiUrl;
  private apiUrl = this.url + '/api';

  constructor(private http: HttpClient) { }


  //Lấy về room id của 2 user

CheckRoomID(request:any):Observable<any> {
    return this.http.post(`${this.apiUrl}/checkRoomId`,request,{observe:'response'}).pipe(
      map((response) => response.body)
    );
  }

  //Hàm tạo room ID
  CreateRoomID(request:any):Observable<any> {
    return this.http.post(`${this.apiUrl}/Room/create`,request,{observe:'response'}).pipe(
      map((response) => response.body)
    );
  }
}

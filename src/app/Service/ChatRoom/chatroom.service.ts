import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatroomService {

  constructor(private http: HttpClient) { }
  private apiUrl = 'http://localhost:8080';

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

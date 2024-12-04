import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private http: HttpClient) { }
  private apiUrl = 'http://localhost:8080';

  //Hàm get hết tin nhắn trong room bằng chatIDRoom

  getAllMessForRoom(roomID:string):Observable<any> {
    return this.http.get(`${this.apiUrl}/MessRoom/${roomID}`,{observe:'response'}).pipe(
      map((response) => response.body)
    );
  }
  //Check
}

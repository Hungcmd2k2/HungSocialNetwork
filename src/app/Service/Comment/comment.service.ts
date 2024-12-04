import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  AddComment(request: any): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/comment/create`, request, { observe: 'response' })
      .pipe(map((response) => response.body));
  }

  //Hàm lấy về comment all của post
  GetAllComment(postId: number): Observable<any> {
    return this.http
      .get(`${this.apiUrl}/comment/post/${postId}`, { observe: 'response' })
      .pipe(map((response) => response.body));
  }
  //Hàm lấy về số lượng comment cho post
  totalComment(postId: number): Observable<any> {
    return this.http
      .get(`${this.apiUrl}/comment/total/${postId}`, { observe: 'response' })
      .pipe(map((response) => response.body));
  }
}

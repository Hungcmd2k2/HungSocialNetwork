import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(private http: HttpClient) {}
  private apiUrl = 'http://localhost:8080/api';

  //hàm thêm mới bài viết
  createPost(postRequest: any): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/post/create`, postRequest, { observe: 'response' })
      .pipe(map((response) => response.body));
  }
  //hàm  thêm file vào bài viết (nếu có)
  add_img_to_post(file: any): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/files/upload`, file, { observe: 'response' })
      .pipe(map((response) => response.body));
  }
  //Hàm cập nhật avatar
  updateAvartar(file: any): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/files/upload/AVATAR`, file, { observe: 'response' })
      .pipe(map((response) => response.body));
  }
  //Hàm cập nhật cover photo
  updateCoverphoto(file: any): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/files/upload/COVER-PHOTO`, file, {
        observe: 'response',
      })
      .pipe(map((response) => response.body));
  }
  // Hàm lấy tất cả post bằng userId
  getAllPostByUserId(userId: any): Observable<any> {
    return this.http
      .get(`${this.apiUrl}/post/${userId}`, { observe: 'response' })
      .pipe(map((response) => response.body));
  }
  //Hàm  lấy tất cả các file liên quan đến postId nếu có
  getAllFileForPost(postId: any): Observable<any> {
    return this.http
      .get(`${this.apiUrl}/files/post/${postId}`, { observe: 'response' })
      .pipe(map((response) => response.body));
  }
}

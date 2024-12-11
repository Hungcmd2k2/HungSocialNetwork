import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../Config/environment';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(private http: HttpClient) {}
  private url =environment.apiUrl;
  private apiUrl = this.url + '/api';


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
  //Hàm xóa bài viết
  deletePost(postId: any): Observable<any> {
    return this.http
      .delete(`${this.apiUrl}/post/${postId}`, { observe: 'response' })
      .pipe(map((response) => response.body));
  }
  //Hàm sửa  bài viết
  editPost(post :any): Observable<any> {
    return this.http
      .put(`${this.apiUrl}/post/edit`,post, { observe: 'response' })
      .pipe(map((response) => response.body));
  }
  //Lấy post  dựa theo  PostId
  getPost(postId: any): Observable<any> {
    return this.http
      .get(`${this.apiUrl}/post/postId/${postId}`, { observe: 'response' })
      .pipe(map((response) => response.body));
  }
}

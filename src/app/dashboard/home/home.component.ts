import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PostService } from '../../Service/Post/post.service';
import { ApiResponseBody } from '../../interFace/ApiResponseBody';

import { PostForHome } from '../../interFace/PostForHome';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent implements OnInit {
  // Khai báo thuộc tính carousel với @ViewChild

  userObject: any = null;
  apiResponseBody : ApiResponseBody |null=null;
  posts: PostForHome[] = [];
  constructor(private toastr: ToastrService,private postService : PostService){};
  ngOnInit(): void {
    this.Who();
  }

  Who() {
    const user = sessionStorage.getItem('session_user');
    if (user) {
      // Chuyển chuỗi JSON thành object
      this.userObject = JSON.parse(user);
    } else {
      this.toastr.error('You are not logged in yet', 'Notification', {
        closeButton: true,
        progressBar: true,
        positionClass: 'toast-top-center',
      });
    }
  }

  Show_Post_By_UserID() {
    this.postService.getAllPostByUserId(this.userObject.userid).subscribe(response => {
      this.apiResponseBody = response;
      console.log(this.apiResponseBody?.data);

      // Chỉ lưu trữ nguyên chuỗi ngày giờ từ API mà không chuyển thành Date
      this.posts = this.apiResponseBody?.data.map((post: PostForHome) => ({
        ...post,
        images: [`http://localhost:8080/api/files/1732527832303_hung2.jpg`,`http://localhost:8080/api/files/1732527832303_hung2.jpg`]  // Thêm ảnh vào mỗi bài đăng, nếu có
      }));

      console.log(this.posts);
    });

  }




}

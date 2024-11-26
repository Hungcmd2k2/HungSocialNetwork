import { PostInfo } from './../../interFace/PostInfo';
import { ApiResponseBody } from './../../interFace/ApiResponseBody';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PostService } from '../../Service/Post/post.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-creat-post',
  templateUrl: './creat-post.component.html',
  styleUrl: './creat-post.component.css',
})
export class CreatPostComponent implements OnInit {
  post = {
    userId: '',
    content: '',
    privacy: 'public',
    tags: '',
    files: [] as File[],
  };
  previews: string[] = []; // Mảng lưu trữ URL hình ảnh preview
  userObject: any = null;
  apiResponseBody: ApiResponseBody | null = null;
  postInfoRespon: PostInfo | null = null;
  postId_Request: any;
  constructor(
    private postService: PostService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private routes: Router
  ) {}
  ngOnInit(): void {
    this.Who();
  }

  // Xử lý sự kiện chọn file
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      // Chuyển FileList thành mảng và lưu vào this.post.files
      this.post.files = Array.from(input.files);
      this.previews = []; // Reset preview

      // Đọc từng file trong this.post.files và tạo URL preview
      for (const file of this.post.files) {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          const result = e.target?.result as string;
          this.previews.push(result); // Lưu URL vào mảng previews
        };
        reader.readAsDataURL(file); // Đọc file dưới dạng Data URL
      }
    }
  }

  // Xử lý sự kiện submit form
  onSubmit(): void {
    this.post.userId = this.userObject.userid;
    this.spinner.show('post_loading');
    setTimeout(() => {
      this.postService.createPost(this.post).subscribe((response) => {
        this.spinner.hide('post_loading');
        this.apiResponseBody = response;
        if (this.apiResponseBody?.code === 200) {
          this.postInfoRespon = this.apiResponseBody.data;
          this.postId_Request = this.postInfoRespon?.id;

          if (this.post.files.length !== 0) {
            this.add_File_Post();
          } else {
            this.toastr.success('Create new post  successful', 'Notification', {
              closeButton: true,
              progressBar: true,
              positionClass: 'toast-top-right',
            });
            this.routes.navigate(['/Dashboard/Home']);
          }
        } else {
          this.toastr.info('Create new post fail', 'Notification', {
            closeButton: true,
            progressBar: true,
            positionClass: 'toast-top-right',
          });
        }
      });
    }, 1000);
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

  add_File_Post() {
    const formData = new FormData();
    formData.append('postId', this.postId_Request);
    // Thêm các file vào FormData
    this.post.files.forEach((file) => {
      formData.append('files', file);
    });
    this.spinner.show('post_loading');
    setTimeout(() => {
      this.postService.add_img_to_post(formData).subscribe((response) => {
        this.spinner.hide('post_loading');
        this.apiResponseBody = response;
        if (this.apiResponseBody?.code === 200) {
          this.toastr.success('Create new post  successful', 'Notification', {
            closeButton: true,
            progressBar: true,
            positionClass: 'toast-top-right',
          });
          this.routes.navigate(['/Dashboard/Home']);
        } else {
          this.toastr.info('Create new post fail', 'Notification', {
            closeButton: true,
            progressBar: true,
            positionClass: 'toast-top-right',
          });
        }
      });
    }, 1000);
  }
}

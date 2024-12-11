import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PostService } from '../../Service/Post/post.service';
import { ApiResponseBody } from '../../interFace/ApiResponseBody';

import { PostForHome } from '../../interFace/PostForHome';
import { from } from 'rxjs';
import { concatMap, map, toArray } from 'rxjs/operators';
import { FollowService } from '../../Service/Follow/follow.service';
import { Router } from '@angular/router';
import { LikeService } from '../../Service/Like/like.service';
import { A } from '@angular/cdk/keycodes';
import { CommentService } from '../../Service/Comment/comment.service';
import { CommentRequest } from '../../interFace/CommentRequest';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  // Khai báo thuộc tính carousel với @ViewChild
  @ViewChild('commentsContainer') commentsContainer!: ElementRef;

  userObject: any = null;
  apiResponseBody: ApiResponseBody | null = null;
  post_showHTML: PostForHome[] = [];
  List_Following = []; // Danh sách userId
  detail = false;
  selectedPost: any = null;

  commentResquest: CommentRequest | null = null;
  newComment: string = '';
  constructor(
    private toastr: ToastrService,
    private postService: PostService,
    private followService: FollowService,
    private route: Router,
    private likeService: LikeService,
    private commentService: CommentService
  ) {}
  ngOnInit(): void {
    this.Who();
  }

  Who() {
    const user = sessionStorage.getItem('session_user');
    if (user) {
      this.userObject = JSON.parse(user);
      this.GetList_Following(this.userObject.userid);
    } else {
      this.toastr.error('You are not logged in yet', 'Notification', {
        closeButton: true,
        progressBar: true,
        positionClass: 'toast-top-center',
      });
    }
  }

  GetList_Following(followerId: number) {
    this.followService.List_Following(followerId).subscribe((response) => {
      this.apiResponseBody = response;
      this.List_Following = this.apiResponseBody?.data;
      this.Show_Post_By_UserIDs();
    });
  }

  Show_Post_By_UserIDs() {
    if (
      !this.List_Following ||
      !Array.isArray(this.List_Following) ||
      this.List_Following.length === 0
    ) {
      this.toastr.info('Follow others to see posts', 'Notification', {
        closeButton: true,
        progressBar: true,
        positionClass: 'toast-top-right',
      });
      return; // Thoát sớm nếu danh sách không hợp lệ
    }

    const posts: any[] = []; // Mảng để lưu trữ kết quả

    from(this.List_Following) // Chuyển mảng userId thành Observable
      .pipe(
        concatMap((userId) =>
          this.postService.getAllPostByUserId(userId).pipe(
            map((response) => {
              const userPosts: PostForHome[] = response?.data || [];
              // Thêm thuộc tính liked mặc định là false(liked: false,totalLike:0,comments:[]})
              return userPosts.map((post) => ({ ...post }));
            })
          )
        ),
        toArray() // Chuyển tất cả kết quả thành một mảng duy nhất
      )
      .subscribe({
        next: (results) => {
          // Hợp nhất tất cả các bài viết
          results.forEach((userPosts) => {
            posts.push(...userPosts);
          });

          // Sắp xếp bài viết theo thời gian (mới nhất trước)
          this.post_showHTML = posts.sort((a, b) => {
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          });

          // console.log(this.post_showHTML);
        },
        error: (err) => {
          console.error('Error fetching posts:', err);
        },
      });
  }

  isVideo(media: string): boolean {
    const videoExtensions = ['mp4', 'webm', 'ogg'];
    const extension = media.split('.').pop()?.toLowerCase();
    return videoExtensions.includes(extension || '');
  }
  //Hàm like
  createCallback(postId: number): () => void {
    return () => this.CheckLikeAndComment(postId);
  }

  CheckLikeAndComment(postId: number): void {
    const likeRequest = { userId: this.userObject.userid, postId: postId };

    this.likeService.isLike(likeRequest).subscribe((response) => {
      this.apiResponseBody = response;
      const post = this.post_showHTML.find((p) => p.id === postId);
      if (this.apiResponseBody?.code === 200) {
        if (post) post.liked = true;
      } else {
        // console.log('Bài viết này chưa like: id:' + postId);
      }
    });

    this.likeService.totalLike(postId).subscribe((response) => {
      this.apiResponseBody = response;
      const post = this.post_showHTML.find((p) => p.id === postId);
      if (this.apiResponseBody?.code === 200) {
        const total = this.apiResponseBody.data;
        if (post) post.totalLike = total;
      } else {
        console.log('có lỗi gì đó ở đoạn lấy số lượng like' + postId);
      }
    });

    this.commentService.totalComment(postId).subscribe((response) => {
      this.apiResponseBody = response;
      const post = this.post_showHTML.find((p) => p.id === postId);
      if (this.apiResponseBody?.code === 200) {
        const total = this.apiResponseBody.data;
        if (post) post.totalComment = total;
      } else {
        console.log('có lỗi gì đó ở đoạn lấy số lượng comment' + postId);
      }
    });
  }

  Like(postId: number) {
    const post = this.post_showHTML.find((p) => p.id === postId);
    const likeRequest = { userId: this.userObject.userid, postId: postId };
    this.likeService.Like(likeRequest).subscribe((response) => {
      this.apiResponseBody = response;
      if (this.apiResponseBody?.code === 200) {
        if (post) {
          post.liked = !post.liked;
          post.totalLike += 1;
        }
      } else {
        console.log('Bài viết này chưa dc like: id:' + postId);
      }
    });
  }

  UnLike(postId: number) {
    const post = this.post_showHTML.find((p) => p.id === postId);
    const likeRequest = { userId: this.userObject.userid, postId: postId };
    this.likeService.UnLike(likeRequest).subscribe((response) => {
      this.apiResponseBody = response;
      if (this.apiResponseBody?.code === 200) {
        if (post) {
          post.liked = !post.liked;
          post.totalLike -= 1;
        }
      } else {
        console.log('Bài viết này chưa dc like: id:' + postId);
      }
    });
  }

  /////////cooment
  showComment(postId: number): void {
    this.route.navigate([`Dashboard/Comment/${postId}`]);
  }
}

import { Component, ElementRef, ViewChild } from '@angular/core';
import { ApiResponseBody } from '../../../interFace/ApiResponseBody';
import { UserProfileOther } from '../../../interFace/UserOtherInfo';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../Service/User/user.service';
import { FollowService } from '../../../Service/Follow/follow.service';
import { ToastrService } from 'ngx-toastr';
import { mapUserProfile } from '../../../interFace/UserOtherInfoMapper';
import { map, Observable } from 'rxjs';
import { PostForHome } from '../../../interFace/PostForHome';
import { PostService } from '../../../Service/Post/post.service';
import { LikeService } from '../../../Service/Like/like.service';
import { CommentService } from '../../../Service/Comment/comment.service';
import { CommentRequest } from '../../../interFace/CommentRequest';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-myself',
  templateUrl: './myself.component.html',
  styleUrl: './myself.component.css'
})
export class MyselfComponent {
  userObject: any = null;
  username: string = '';
  apiResponseBody : ApiResponseBody | null =null;
  dataUser :UserProfileOther |null =null;
  post_showHTML: PostForHome[] = [];
  selectedPost: any = null;
  detail =false;
  newComment: string = '';
  commentResquest : CommentRequest |null=null;


  @ViewChild('commentsContainer') commentsContainer!: ElementRef;
  constructor( private spinner: NgxSpinnerService, private commentService:CommentService,private likeService:LikeService,private route: Router,private userService : UserService,private postService:PostService,private toastr: ToastrService) {}
//Thay avatar
 // Xử lý sự kiện chọn file

 post = {
  files: [] as File[],
};
onFileSelected_Cover_Photo(event :Event):void{
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    this.post.files = Array.from(input.files);

    // Gửi API
    this.UpdateCoverPhoto();
  }
  setTimeout(()=>{
    window.location.reload();
  },2000)
}


onFileSelected(event: Event): void {
  const input = event.target as HTMLInputElement;

  if (input.files && input.files.length > 0) {
    this.post.files = Array.from(input.files);

    // Gửi API
    this.UpdateAvatar();
  }
  setTimeout(()=>{
    window.location.reload();
  },2000)
}
//update cover photo
UpdateCoverPhoto(){
  const formData = new FormData();
  formData.append('userId', this.userObject.userid.toString());
  this.post.files.forEach((file) => formData.append('files', file));

  console.log('FormData content:');
for (const [key, value] of (formData as any).entries()) {
  console.log(`${key}:`, value);
}

  this.postService.updateCoverphoto(formData).subscribe(
    (response) => {
      this.apiResponseBody = response;
      if (this.apiResponseBody?.code === 200) {
        this.toastr.success('Update cover photo successful', 'Notification', {
          closeButton: true,
          progressBar: true,
          positionClass: 'toast-top-right',
        });


      } else {
        this.toastr.error('Update cover photo failed', 'Notification', {
          closeButton: true,
          progressBar: true,
          positionClass: 'toast-top-right',
        });
      }
    },
    (error) => {
      this.toastr.error('Error occurred while updating avatar', 'Notification', {
        closeButton: true,
        progressBar: true,
        positionClass: 'toast-top-right',
      });
      console.error(error);
    }
  );
}
//Hàm gửi api update AVATAR
UpdateAvatar() {
  const formData = new FormData();
  formData.append('userId', this.userObject.userid.toString());
  this.post.files.forEach((file) => formData.append('files', file));

  console.log('FormData content:');
for (const [key, value] of (formData as any).entries()) {
  console.log(`${key}:`, value);
}

  this.postService.updateAvartar(formData).subscribe(
    (response) => {
      this.apiResponseBody = response;
      if (this.apiResponseBody?.code === 200) {
        this.toastr.success('Update avatar successful', 'Notification', {
          closeButton: true,
          progressBar: true,
          positionClass: 'toast-top-right',
        });


      } else {
        this.toastr.error('Update avatar failed', 'Notification', {
          closeButton: true,
          progressBar: true,
          positionClass: 'toast-top-right',
        });
      }
    },
    (error) => {
      this.toastr.error('Error occurred while updating avatar', 'Notification', {
        closeButton: true,
        progressBar: true,
        positionClass: 'toast-top-right',
      });
      console.error(error);
    }
  );
}




  Who(){
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
  ngOnInit(): void {
    this.Who();
    this.getUsernameOther();
    this.Show_Post_By_UserID();
  }

  getUsernameOther(){
      // Logic khác dựa trên username
     this.userService.getUserOther(this.userObject.username).subscribe(response =>{
      this.apiResponseBody = response;
      this.dataUser = mapUserProfile(this.apiResponseBody?.data);
     })
  }

 goEdit(){
  this.route.navigate(['/Dashboard/Profile/Edit']);
 }

 Show_Post_By_UserID() {
    this.postService.getAllPostByUserId(this.userObject.userid).subscribe(response => {
      this.apiResponseBody = response;
      this.post_showHTML = this.apiResponseBody?.data;
      this.post_showHTML = this.post_showHTML.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    });
  }
 // của post-list
 isVideo(media: string): boolean {
  const videoExtensions = ['mp4', 'webm', 'ogg'];
  const extension = media.split('.').pop()?.toLowerCase();
  return videoExtensions.includes(extension || '');
}
//check like
createCallback(postId: number): () => void {
  return () => this.CheckLikeAndComment(postId);
}

CheckLikeAndComment(postId: number): void {
  const likeRequest = { userId: this.userObject.userid, postId: postId };

  this.likeService.isLike(likeRequest).subscribe(response => {
    this.apiResponseBody = response;
    const post = this.post_showHTML.find(p => p.id === postId);
    if (this.apiResponseBody?.code === 200) {
      if (post) post.liked = true;
    } else {
      // console.log('Bài viết này chưa like: id:' + postId);
    }
  });

  this.likeService.totalLike(postId).subscribe(response =>{
    this.apiResponseBody = response;
    const post = this.post_showHTML.find(p => p.id === postId);
    if (this.apiResponseBody?.code === 200) {
      const total = this.apiResponseBody.data;
      if (post) post.totalLike = total;
    } else {
      console.log('có lỗi gì đó ở đoạn lấy số lượng like' + postId);
    }
  })

  this.commentService.totalComment(postId).subscribe(response =>{
    this.apiResponseBody = response;
    const post = this.post_showHTML.find(p => p.id === postId);
    if (this.apiResponseBody?.code === 200) {
      const total = this.apiResponseBody.data;
      if (post) post.totalComment = total;
    } else {
      console.log('có lỗi gì đó ở đoạn lấy số lượng comment' + postId);
    }
  })


}

Like(postId:number){
  const post = this.post_showHTML.find(p => p.id === postId);
  const likeRequest = { userId: this.userObject.userid, postId: postId };
  this.likeService.Like(likeRequest).subscribe(response =>{
    this.apiResponseBody = response;
    if (this.apiResponseBody?.code === 200) {
      if (post) {
        post.liked = !post.liked;
        post.totalLike+=1;
      }
    } else {
      console.log('Bài viết này chưa dc like: id:' + postId);
    }
  })
}

UnLike(postId:number){
  const post = this.post_showHTML.find(p => p.id === postId);
  const likeRequest = { userId: this.userObject.userid, postId: postId };
  this.likeService.UnLike(likeRequest).subscribe(response =>{
    this.apiResponseBody = response;
    if (this.apiResponseBody?.code === 200) {

      if (post) {
        post.liked = !post.liked;
        post.totalLike-=1;
      }

    } else {
      console.log('Bài viết này chưa dc like: id:' + postId);
    }
  })
}
/////////cooment
showComment(postId: number): void {
  this.route.navigate([`Dashboard/Comment/${postId}`]);
}
//Get all comment by postId;





//Delete Post
deletePost(postId:number){
  Swal.fire({
    title: 'Are you sure delete post ?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes',
  }).then((result) => {
    if (result.isConfirmed) {
      this.postService.deletePost(postId).subscribe(res =>{
        this.apiResponseBody=res;
        if(this.apiResponseBody?.code===200){
          this.toastr.success('Delete Post success', 'Notification', {
            closeButton: true,
            progressBar: true,
            positionClass: 'toast-top-right',
          });
          setTimeout(()=>{
            window.location.reload();
          },1000)
        }else{
          this.toastr.error('Delete Post Fail', 'Notification', {
            closeButton: true,
            progressBar: true,
            positionClass: 'toast-top-right',
          });
        }
      })
    }
  });
}
editPost(postId:number){
  this.route.navigate([`Dashboard/Profile/edit-post/${postId}`]);
}
}

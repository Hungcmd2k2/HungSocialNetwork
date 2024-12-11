import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommentRequest } from '../../interFace/CommentRequest';
import { CommentService } from '../../Service/Comment/comment.service';
import { ApiResponseBody } from '../../interFace/ApiResponseBody';
import { PostForHome } from '../../interFace/PostForHome';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../../Service/Post/post.service';
import { UserService } from '../../Service/User/user.service';
import { LikeService } from '../../Service/Like/like.service';
import { PostForComment } from '../../interFace/PostForComment';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css',
})
export class CommentComponent implements OnInit,AfterViewInit {
  @ViewChild('CommentContainer') CommentContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('commentInput') messageInput!: ElementRef<HTMLTextAreaElement>;
  userObject: any = null;
  postId: any;
  newComment: string = '';
  commentResquest: CommentRequest | null = null;
  apiResponseBody: ApiResponseBody | null = null;
  post_showHTML: PostForComment = {
    userAvatar: '',
    userName: '',
    images: [],
    id: 0,
    userId: 0,
    content: '',
    privacy: '',
    tags: '',
    createdAt: '',
    updatedAt: '',
    liked: false,
    totalLike: 0,
    totalComment: 0,
    comments: [],
  };

  constructor(
    private commentService: CommentService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private postService: PostService,
    private userService: UserService,
    private likeService :LikeService,
    private cdr: ChangeDetectorRef,
  ) {}
  ngOnInit(): void {
    this.Who();
    this.route.params.subscribe((params) => {
      this.postId = params['postId'];
      this.getPost(this.postId);
    });
  }
  ngAfterViewInit(): void {
    this.focusTextarea();
    this.scrollToBottom();
  }
  focusTextarea(): void {
    if (this.messageInput) {
      this.messageInput.nativeElement.focus();
    }
  }
  isVideo(media: string): boolean {
    const videoExtensions = ['mp4', 'webm', 'ogg'];
    const extension = media.split('.').pop()?.toLowerCase();
    return videoExtensions.includes(extension || '');
  }
  togglePostDetails(): void {
    window.location.reload();
  }
  //add comment
  addComment(postIdRq: number, parentIdRq: any) {
    if (this.newComment.trim()) {
      const userIdRq = this.userObject.userid;
      this.commentResquest = {
        userId: userIdRq,
        postId: postIdRq,
        content: this.newComment,
        parentId: parentIdRq,
      };
      console.log(this.commentResquest);
      this.commentService
        .AddComment(this.commentResquest)
        .subscribe((response) => {
          this.apiResponseBody = response;
          if (this.apiResponseBody?.code === 200) {
            this.newComment = '';
            window.location.reload();
          }
        });
    } else {
      this.toastr.info('Conntent not null', 'Notification', {
        closeButton: true,
        progressBar: true,
        positionClass: 'toast-top-right',
      });
    }
  }
  Who() {
    const user = sessionStorage.getItem('session_user');
    if (user) {
      this.userObject = JSON.parse(user);
    } else {
      this.toastr.error('You are not logged in yet', 'Notification', {
        closeButton: true,
        progressBar: true,
        positionClass: 'toast-top-center',
      });
    }
  }
  //Get all comment by postId;

  getPost(postId: number) {
    // Lấy bài viết chính
    this.postService.getPost(postId).subscribe((res) => {
      this.apiResponseBody = res;
      if (this.apiResponseBody?.code === 200) {
        const dataPost = this.apiResponseBody.data;

        // Gán dữ liệu cơ bản trước
        this.post_showHTML = {
          userAvatar: '', // Sẽ được cập nhật từ API khác
          userName: '', // Sẽ được cập nhật từ API khác
          images: [], // Sẽ được cập nhật từ API khác
          id: dataPost.id,
          userId: dataPost.userId,
          content: dataPost.content,
          privacy: dataPost.privacy,
          tags: dataPost.tags,
          createdAt: dataPost.createdAt,
          updatedAt: dataPost.updatedAt,
          liked: false, // Sẽ được cập nhật từ API khác
          totalLike: 0, // Sẽ được cập nhật từ API khác
          totalComment: 0, // Sẽ được cập nhật từ API khác
          comments: [], // Sẽ được cập nhật từ API khác
        };

        // Gọi thêm API để lấy dữ liệu bổ sung
        this.getUserInfo(dataPost.userId);
        this.getUserAvatar(dataPost.userId);
        this.getPostLikes(dataPost.id);
        this.getPostComments(dataPost.id);
        this.getPostImages(dataPost.id);
        this.checkisLike(dataPost.id);
        this.getAllComment(dataPost.id);
      }
    });
  }
  getUserInfo(userId: number) {
    this.userService.getUserById(userId).subscribe(userRes =>{
      this.apiResponseBody=userRes;
      const userName =this.apiResponseBody?.data.username;
      this.post_showHTML.userName =userName;
    })
  }
  getUserAvatar(userId:number){
    this.userService.getUserdetail(userId).subscribe(avatarRes =>{
     this.apiResponseBody=avatarRes;
     const avatar =this.apiResponseBody?.data.avatar;
     this.post_showHTML.userAvatar=avatar;
    })
  }
  getPostLikes(postId: number) {
    this.likeService.totalLike(postId).subscribe(likeRes => {
      this.apiResponseBody = likeRes;
      const totallike =this.apiResponseBody?.data
      this.post_showHTML.totalLike = totallike;

    })
  }
  getPostComments(postId: number) {
    this.commentService.totalComment(postId).subscribe(response => {
      this.apiResponseBody = response;
      const totalComment = this.apiResponseBody?.data;
      this.post_showHTML.totalComment=totalComment;
    })
  }
  getPostImages(postId: number) {
    this.postService.getAllFileForPost(postId).subscribe(imageRes =>{
      this.apiResponseBody =imageRes;
      const images = this.apiResponseBody?.data;

      if (this.post_showHTML) {
        // Lọc dữ liệu nếu cần và thêm vào `post_showHTML.images`
        images
          .filter((img: any) => img.fileName && img.filePath) // Lọc chỉ giữ lại các mục hợp lệ
          .forEach((img: any) => {
            this.post_showHTML.images.push({
              fileName: img.fileName,
              filePath: img.filePath,
            });
          });
      }

    })
  }
  checkisLike(postId :number){
    const likeRequest = { userId: this.userObject.userid, postId: postId };

    this.likeService.isLike(likeRequest).subscribe(response => {
      this.apiResponseBody = response;
      if(this.apiResponseBody?.code===200){
        this.post_showHTML.liked=true;
      }else{

      }
    });
  }
  getAllComment(postId: number) {
    this.commentService.GetAllComment(postId).subscribe(response => {
      this.apiResponseBody = response;
      const dataComment = this.apiResponseBody?.data;
     if (this.post_showHTML) {
      // Lọc dữ liệu nếu cần và thêm vào `post_showHTML.images`
      dataComment
        .filter((cmt: any) => cmt.userAvatar && cmt.userName && cmt.content) // Lọc chỉ giữ lại các mục hợp lệ
        .forEach((cmt: any) => {
          this.post_showHTML.comments.push({
            userAvatar: cmt.userAvatar,
            userName: cmt.userName,
            content:cmt.content
          });
        });
    }

    })

  }


  Like(postId: number) {
    const likeRequest = { userId: this.userObject.userid, postId: postId };
    this.likeService.Like(likeRequest).subscribe(response => {
      this.apiResponseBody = response;
      if (this.apiResponseBody?.code === 200) {
          this.post_showHTML.liked = !this.post_showHTML.liked;
          this.post_showHTML.totalLike += 1;
      } else {
        console.log('Bài viết này chưa dc like: id:' + postId);
      }
    })

  }
  UnLike(postId: number) {
    const likeRequest = { userId: this.userObject.userid, postId: postId };
    this.likeService.UnLike(likeRequest).subscribe(response => {
      this.apiResponseBody = response;
      if (this.apiResponseBody?.code === 200) {
          this.post_showHTML.liked = !this.post_showHTML.liked;
          this.post_showHTML.totalLike -= 1;
      } else {
        console.log('Bài viết này chưa dc like: id:' + postId);
      }
    })
  }

  scrollToBottom(): void {
    setTimeout(() => {
      if (this.CommentContainer?.nativeElement) {
        this.CommentContainer.nativeElement.scrollTop =
          this.CommentContainer.nativeElement.scrollHeight;
      }
      this.cdr.detectChanges();
    }, 300);
  }
}

import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiResponseBody } from '../../../interFace/ApiResponseBody';
import { PostService } from '../../../Service/Post/post.service';
import { EditPost } from '../../../interFace/EditPost';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrl: './edit-post.component.css'
})
export class EditPostComponent implements OnInit {
  constructor(private routes: Router,private route: ActivatedRoute, private spinner: NgxSpinnerService,private postService : PostService, private toastr: ToastrService,){}
  ngOnInit(): void {
    this.getPostbyId();
  }
  post = {
    id: '',
    content: '',
    privacy: '',
    tags: '',
  };
  previews: string[] = [];
  apiResponseBody: ApiResponseBody | null = null;
  postNew : EditPost |null=null;
  postId:any;

  onSubmit(): void {
    this.postService.editPost(this.post).subscribe(res =>{
      this.apiResponseBody=res;
      if(this.apiResponseBody?.code===200){
        this.toastr.success('Edit post successful', 'Notification', {
          closeButton: true,
          progressBar: true,
          positionClass: 'toast-top-right',
        });
        this.routes.navigate(['/Dashboard/Profile/Myself']);
      }
      else{
        this.toastr.error('Edit post fail', 'Notification', {
          closeButton: true,
          progressBar: true,
          positionClass: 'toast-top-right',
        });
      }
    })
  }

  getPostbyId(){
    this.route.params.subscribe((params) => {
      this.postId = params['postId'];
    });
    this.postService.getPost(this.postId).subscribe(res =>{
      this.apiResponseBody=res;
      console.log(this.apiResponseBody?.data)
      this.post =this.apiResponseBody?.data;
    })
  }
}

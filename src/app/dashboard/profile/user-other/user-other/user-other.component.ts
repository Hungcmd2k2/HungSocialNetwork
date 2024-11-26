
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../../Service/User/user.service';
import { ApiResponseBody } from '../../../../interFace/ApiResponseBody';
import { UserProfileOther } from '../../../../interFace/UserOtherInfo';
import { mapUserProfile } from '../../../../interFace/UserOtherInfoMapper';
import { FollowService } from '../../../../Service/Follow/follow.service';
import { ToastrService } from 'ngx-toastr';
import { map, Observable } from 'rxjs';
@Component({
  selector: 'app-user-other',
  templateUrl: './user-other.component.html',
  styleUrl: './user-other.component.css'
})
export class UserOtherComponent implements OnInit {
  public userObject: any = null;
  username: string = '';
  apiResponseBody : ApiResponseBody | null =null;
  dataUser :UserProfileOther |null =null;
  constructor(private route: ActivatedRoute,private userService : UserService,private followService :FollowService,private toastr: ToastrService) {}
  isFollowing: boolean = false;

   checkFollow ={
     followerId: 0,
     followingId: 0,
  };

  toggleFollow(): void {

    if(this.isFollowing===false){
      this.follow().subscribe(result => {
        if (result) {
          this.toastr.success('Follow success', 'Notification', {
            closeButton: true,
            progressBar: true
          });
          this.isFollowing = !this.isFollowing;
        } else {
          console.log('Follow thất bại!');
        }
      });
    }
    else{
      this.unfollow().subscribe(result => {
        if (result) {
          this.toastr.error(' UnFollow success', 'Notification', {
            closeButton: true,
            progressBar: true
          });
          this.isFollowing = !this.isFollowing;
        } else {
          console.log('UnFollow thất bại!');
        }
      });
    }
  }
  Who(){
    const user = sessionStorage.getItem('session_user');
  if (user) {
    // Chuyển chuỗi JSON thành object
    this.userObject = JSON.parse(user);
    this.checkFollow.followerId = this.userObject.userid;
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
  }

  getUsernameOther(){
    this.route.params.subscribe(params => {
      this.username = params['username'];
      // Logic khác dựa trên username
     this.userService.getUserOther(this.username).subscribe(response =>{
      this.apiResponseBody = response;
      this.dataUser = mapUserProfile(this.apiResponseBody?.data);
      this.checkFollow.followingId=this.dataUser.userid;
      this.show();
     })
    });
  }

  show(){
    this.followService.checkFollow(this.checkFollow).subscribe(response =>{
      this.apiResponseBody =response;
      if(this.apiResponseBody?.code===200){

        this.isFollowing=true;
      }
      else{

        this.isFollowing=false;
      }
    })
    }

    follow(): Observable<boolean> {
      return this.followService.Follow(this.checkFollow).pipe(
        map(response => {
          this.apiResponseBody = response;
          return this.apiResponseBody?.code === 200; // Trả về true/false dựa trên điều kiện
        })
      );
    }

    unfollow(): Observable<boolean>{
      return this.followService.UnFollow(this.checkFollow).pipe(
        map(response => {
          this.apiResponseBody = response;
          return this.apiResponseBody?.code === 200; // Trả về true/false dựa trên điều kiện
        })
      );
    }
  }


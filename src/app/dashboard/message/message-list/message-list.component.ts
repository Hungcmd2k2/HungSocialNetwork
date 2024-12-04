import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FollowService } from '../../../Service/Follow/follow.service';
import { ToastrService } from 'ngx-toastr';
import { ApiResponseBody } from '../../../interFace/ApiResponseBody';
import { UserService } from '../../../Service/User/user.service';
import { UserProfileOther } from '../../../interFace/UserOtherInfo';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.css',
})
export class MessageListComponent implements OnInit {
  userObject: any;
  apiResponseBody: ApiResponseBody | null = null;
  listId: number[] = [];

  listDetail : UserProfileOther[] =[];
  constructor(
    private router: Router,
    private followService: FollowService,
    private toastr: ToastrService,
    private userService:UserService
  )
  {
    this.Who();
  }

  ngOnInit(): void {
    this.getListFolowing();

  }
  goMessDetail(userReceiverId :number) {
    this.router.navigate([`Dashboard/Message/detail/${userReceiverId}`]);
  }
  Who() {
    const user = sessionStorage.getItem('session_user');
    if (user) {
      // Chuyển chuỗi JSON thành object
      this.userObject = JSON.parse(user);
    } else {
      this.toastr.warning('You are not logged in yet', 'Notification', {
        closeButton: true,
        progressBar: true,
        positionClass: 'toast-top-center',
      });
    }
  }
  getListFolowing() {
    this.followService
      .List_Following(this.userObject.userid)
      .subscribe((response) => {
        this.apiResponseBody = response;
        this.listId=this.apiResponseBody?.data;
        console.log(this.listId);
        this.ShowListFollowing();
      });

    }

  ShowListFollowing(){
    this.listId.forEach(id => {
      this.userService.getUserdetail(id).subscribe(response =>{
        this.apiResponseBody=response;
        if(this.apiResponseBody?.code===200){
          this.listDetail.push(this.apiResponseBody?.data);
        }
        else{
          console.log("ko lấy dc");
        }
      })
    });
  console.log(this.listDetail);
  }
}

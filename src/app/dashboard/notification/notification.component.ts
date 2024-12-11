import { Component, OnInit } from '@angular/core';
import { NotificationsService } from '../../Service/Notifications/notifications.service';
import { NotificationInterface } from '../../interFace/Notification';
import { ToastrService } from 'ngx-toastr';
import { ApiResponseBody } from '../../interFace/ApiResponseBody';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent implements OnInit {
  userObject: any = null;
  apiResponseBody: ApiResponseBody | null = null;
constructor(private  notifi : NotificationsService,private toastr:ToastrService){}
  ngOnInit(): void {
    this.Who();

  }



listNotifi :NotificationInterface[]=[];
Who() {
  const user = sessionStorage.getItem('session_user');
  if (user) {
    this.userObject = JSON.parse(user);
    this.notifi.getNotifiByUserid(this.userObject.userid).subscribe(res => {
      this.apiResponseBody = res;

      if (Array.isArray(this.apiResponseBody?.data)) {
        // Gán và sắp xếp danh sách theo thời gian
        this.listNotifi = this.apiResponseBody.data.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0).getTime();
          const dateB = new Date(b.createdAt || 0).getTime();
          return dateB - dateA; // Sắp xếp giảm dần
        });
      } else {
        console.error("API response 'data' is not an array");
      }

    });
  } else {
    this.toastr.warning('You are not logged in yet', 'Notification', {
      closeButton: true,
      progressBar: true,
      positionClass: 'toast-top-center',
    });
  }
}

}

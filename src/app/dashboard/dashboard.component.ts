import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  debounceTime,
  distinctUntilChanged,
  Subject,
  switchMap,
  map,
  delay,
} from 'rxjs';
import Swal from 'sweetalert2';
import { UserService } from '../Service/User/user.service';
import { ApiResponseBody } from '../interFace/ApiResponseBody';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { WebSocketService } from '../Service/Websocket/websocket.service';
import { NotificationsService } from '../Service/Notifications/notifications.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  public userObject: any = null;

  constructor(
    private routes: Router,
    private toastr: ToastrService,
    private notifi: NotificationsService
  ) {

  }
  menus = [
    { link: '/Dashboard/Home', title: 'Home', label: 'Home', icon: 'bi bi-house' },
    { link: '/Dashboard/Creat-Post', title: 'New post', label: 'Post', icon: 'bi bi-patch-plus' },
    { link: '/Dashboard/Message', title: 'Message', label: 'Message', icon: 'bi bi-chat' },
    { link: '/Dashboard/Notification', title: 'Notification', label: 'Notification', icon: 'bi bi-bell' },
    { link: '/Dashboard/Profile', title: 'Profile', label: 'Profile', icon: 'bi bi-person' },
    { link: '/Dashboard/Search', title: 'Search', label: 'Search', icon: 'bi bi-search' },
    { link: '/Dashboard/Setting', title: 'Setting', label: 'Setting', icon: 'bi bi-gear' },
  ];

  reloadCurrentPage() {
    window.location.reload();
  }


  ngOnInit(): void {
    this.Who();
    this.notifi.initConnectionSocket(this.userObject.username);
  }


  title: string = 'Home';
  setTitle(newTitle: string) {
    this.title = newTitle;
  }

  logout() {
    Swal.fire({
      title: 'Are you sure logout ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.clear();
        localStorage.clear();
        this.routes.navigate(['/']);
      }
    });
  }

  Who() {
    const user = sessionStorage.getItem('session_user');
    if (user) {
      this.userObject = JSON.parse(user);
    } else {
      this.toastr.warning('You are not logged in yet', 'Notification', {
        closeButton: true,
        progressBar: true,
        positionClass: 'toast-top-center',
      });
    }
  }

  showNotification(): void {
    this.toastr.warning('Bạn chưa đăng nhập', 'Notification', {
      closeButton: true,
      progressBar: true,
    });
  }
  ///Response

}

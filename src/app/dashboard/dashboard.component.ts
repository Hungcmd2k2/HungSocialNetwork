import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject, switchMap, map, delay } from 'rxjs';
import Swal from 'sweetalert2';
import { UserService } from '../Service/User/user.service';
import { ApiResponseBody } from '../interFace/ApiResponseBody';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{
  public userObject: any = null;
  searchQuery: string = ''; // Biến chứa từ khóa tìm kiếm
  private searchSubject: Subject<string> = new Subject<string>();
  listUser: { username: string; fullname: string; avatar: string }[] = [];
  constructor(private routes : Router,private userService: UserService,private spinner: NgxSpinnerService,private toastr: ToastrService) {

  }

  onUserClick(user: any): void {
    this.routes.navigate([`/Dashboard/Profile/user-other/${user.username}`]);
  }

  ngOnInit(): void {
    this.Who();
    this.callApiSearch();
  }

  callApiSearch(){
    this.listUser = [];
    // Lắng nghe các từ khóa từ Subject và gọi API sau debounceTime
    this.searchSubject
      .pipe(
        debounceTime(300), // Chờ 300ms sau khi ngừng gõ
      )
      .subscribe((keyword) => {
        // Nếu từ khóa trống, không gọi API, và làm trống danh sách
        if (keyword.trim() === '') {
          this.listUser = [];
        } else {
          this.spinner.show('search_user');
          setTimeout(() => {
            this.userService.searchUser(keyword).subscribe({
              next: (result) => {
                this.spinner.hide('search_user')
                if (result && result.data && result.data.length > 0) {
                  this.listUser = result.data.map((user: any) => ({
                    username: user.username,
                    fullname: user.fullname,
                    avatar: user.avatar,
                  }));
                } else {
                  this.listUser = []; // Gán mảng rỗng nếu không có kết quả
                }
              },
              error: (err) => {
                // this.loading = false;
                console.error("Error fetching search results:", err);
                this.listUser = []; // Gán mảng rỗng khi có lỗi
              },
            });
          }, 1000);
        }
      });
  }

  onSearch(): void {
    const keyword = this.searchQuery.trim();  // Lấy giá trị từ ô nhập liệu và loại bỏ khoảng trắng thừa
    if (keyword === '') {
      // Chỉ khi từ khóa thực sự trống mới làm trống listUser
      this.listUser = [];
      return;
    }
    this.searchSubject.next(keyword);  // Đẩy từ khóa vào Subject nếu không trống
  }

  title: string = 'Home';
  setTitle(newTitle: string) {
    this.title = newTitle;
  }


  logout(){
    Swal.fire({
      title: "Are you sure logout ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes"
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.clear();
        localStorage.clear();
        this.routes.navigate(['/']);
      }
    });

  }

  Who(){
    const user = sessionStorage.getItem('session_user');
  if (user) {
    // Chuyển chuỗi JSON thành object
    const userObject = JSON.parse(user);
  } else {
    this.toastr.warning('You are not logged in yet', 'Notification', {
      closeButton: true,
      progressBar: true,
      positionClass: 'toast-top-center',
    });
  }
  }

  showNotification(): void {
    this.toastr.warning('Bạn chưa đăng nhập', 'Notification',{
      closeButton:true,
      progressBar:true
    });
  }
}

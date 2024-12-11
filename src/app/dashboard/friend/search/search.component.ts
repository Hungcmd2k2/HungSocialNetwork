import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { debounceTime, Subject } from 'rxjs';
import { UserService } from '../../../Service/User/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {
  constructor(private spinner: NgxSpinnerService,private userService: UserService,private toastr: ToastrService, private routes: Router){

  }
  public userObject: any = null;
  searchQuery: string = ''; // Biến chứa từ khóa tìm kiếm
  private searchSubject: Subject<string> = new Subject<string>();
  listUser: {
    userid: number;
    username: string;
    fullname: string;
    avatar: string;
  }[] = [];
  ngOnInit(): void {
    this.Who();
    this.callApiSearch();
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

  onSearch(): void {
    const keyword = this.searchQuery.trim(); // Lấy giá trị từ ô nhập liệu và loại bỏ khoảng trắng thừa
    if (keyword === '') {
      // Chỉ khi từ khóa thực sự trống mới làm trống listUser
      this.listUser = [];
      return;
    }
    this.searchSubject.next(keyword); // Đẩy từ khóa vào Subject nếu không trống
  }


  callApiSearch() {
    this.listUser = [];
    // Lắng nghe các từ khóa từ Subject và gọi API sau debounceTime
    this.searchSubject
      .pipe(
        debounceTime(300) // Chờ 300ms sau khi ngừng gõ
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
                this.spinner.hide('search_user');
                if (result && result.data && result.data.length > 0) {
                  this.listUser = result.data.map((user: any) => ({
                    userid: user.userid,
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
                console.error('Error fetching search results:', err);
                this.listUser = []; // Gán mảng rỗng khi có lỗi
              },
            });
          }, 1000);
        }
      });
  }

  onUserClick(user: any): void {
    const id = user.userid;
    const id_session = this.userObject.userid;
    if (id === id_session) {
      this.routes.navigate([`/Dashboard/Profile/Myself`]);
    } else {
      this.routes.navigate([`/Dashboard/Profile/user-other/${user.username}`]);
    }
  }
}

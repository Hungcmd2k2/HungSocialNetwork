import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../Service/User/user.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { passwordMatchValidator } from '../Validator/password-match';
import Swal from 'sweetalert2';
import { map, Observable } from 'rxjs';
import { ApiResponseBody } from '../interFace/ApiResponseBody';
import { HttpResponse } from '@angular/common/http';
import { noWhitespaceOrDiacritics } from '../Validator/username-check';

@Component({
  selector: 'app-registration-page',
  templateUrl: './registration-page.component.html',
  styleUrl: './registration-page.component.css',
})
export class RegistrationPageComponent implements OnInit {
  images: string[] = [
    'assets/images/LoginPage/Registration.jpg',
    'assets/images/LoginPage/LoginPage.jpg',
    'assets/images/LoginPage/LoginPage_2.jpg',
  ];
  // Biến lưu trữ đường dẫn hình ảnh ngẫu nhiên
  randomImage: string | undefined;
  //Form Registration
  registrationForm: FormGroup;
  user: any = null;

  //Form OTP
  isFormOpen: boolean = false;
  countdown: number = 10; // Thời gian đếm ngược bắt đầu từ 10 giây
  isLinkDisabled: boolean = true; // Trạng thái của liên kết (vô hiệu hóa ban đầu)
  private interval: any; // Biến để lưu ID của setInterval

  constructor(private routes: Router, private userService: UserService) {
    this.registrationForm = new FormGroup(
      {
        email: new FormControl('', [Validators.required, Validators.email]),
        username: new FormControl('',[Validators.required,noWhitespaceOrDiacritics()] ),
        password: new FormControl('', [Validators.required,Validators.minLength(6)]),
        conf_password: new FormControl('', Validators.required),
      },
      { validators: passwordMatchValidator('password', 'conf_password') }
    );


  }

  ngOnInit(): void {
    this.setRandomImage();
    this.startCountdown();
  }

  //All Function
  apiResponseBody:  ApiResponseBody | null = null;
  apiResponse : HttpResponse<any> |null =null;

  onSubmit(): void {
    if (this.registrationForm.valid) {
      const email = this.registrationForm.value.email;
      this.checkEmail(email).subscribe(check_email =>{
        if(check_email==true){
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Email existed!',
          });
        }
        else{
          const username = this.registrationForm.value.username;
          this.checkUsername(username).subscribe(check_username =>{
            if(check_username== true){
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Username existed!',
              });
            }
            else{
              const formData = {
                email: this.registrationForm.value.email,
                username: this.registrationForm.value.username,
                password: this.registrationForm.value.password
              };
              this.checkRegist(formData).subscribe(check_regist =>{
                if(check_regist==true){
                  Swal.fire({
                    icon: "success",
                    title: "Successful",
                    text: "Account created successfully",
                  });
                }
                else{
                  Swal.fire({
                    icon: "error",
                    title: "Opp..",
                    text: "Have error during process registration",
                  });
                }
              })
            }
          })
        }
      });
  }
}

  checkEmail(email: string): Observable<boolean> {
    return this.userService.getUserByEmail(email).pipe(
      map(response => {
        this.apiResponseBody = response.body;
        return this.apiResponseBody?.code === 200;
      })
    );
  }
  checkUsername(username : string) :Observable<boolean> {
    return this.userService.getUserByUsername(username).pipe(
      map(response => {
        this.apiResponseBody = response.body;
        return this.apiResponseBody?.code === 200;
      })
    );
  }

  checkRegist(form:any): Observable<boolean>{
    return this.userService.createUser(form).pipe(
      map(response =>{
        this.apiResponseBody = response.body;
        return this.apiResponseBody?.code === 200;
      })
    );
  }

  // Chọn ngẫu nhiên một hình ảnh
  setRandomImage(): void {
    const randomIndex = Math.floor(Math.random() * this.images.length);
    this.randomImage = this.images[randomIndex];
  }

  //Ẩn hiện Confirm OTP
  // Hàm mở form
  openForm() {
    this.isFormOpen = true;
  }

  // Hàm đóng form
  closeForm() {
    this.isFormOpen = false;
    alert('Tạo tài khoản thành công?');
    window.location.reload();
  }

  // Hàm bắt đầu đếm ngược
  startCountdown() {
    // Đặt lại bộ đếm ngược về 10 giây mỗi lần gọi
    this.countdown = 10;
    this.isLinkDisabled = true; // Vô hiệu hóa liên kết khi bắt đầu đếm ngược

    // Nếu có interval cũ, xóa bỏ nó
    if (this.interval) {
      clearInterval(this.interval);
    }

    // Bắt đầu bộ đếm ngược mới
    this.interval = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
      } else {
        this.isLinkDisabled = false; // Kích hoạt liên kết sau khi đếm ngược xong
        clearInterval(this.interval); // Dừng bộ đếm ngược
      }
    }, 1000); // Cập nhật mỗi giây
  }

  // Hàm xử lý sự kiện nhấn vào liên kết (Resend OTP)
  resendOTP() {
    alert('Ấn gửi lại otp thành công!');
    // Thực hiện gửi lại OTP ở đây
    this.startCountdown();
  }
}

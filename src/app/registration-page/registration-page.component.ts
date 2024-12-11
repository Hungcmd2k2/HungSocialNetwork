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
import { OtpService } from '../Service/Otp/otp.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-registration-page',
  templateUrl: './registration-page.component.html',
  styleUrl: './registration-page.component.css',
})
export class RegistrationPageComponent implements OnInit {
  images: string[] = [
    'assets/images/LoginPage/Registration.jpg',
    'assets/images/LoginPage/LoginPage.jpg',
  ];
  randomImage: string | undefined;
  //Form Registration
  registrationForm: FormGroup;
  user: any = null;

  isFormOpen: boolean = false;
  otp:string ='';
  usingOTP : boolean =false;
  countdown: number = 20;
  isLinkDisabled: boolean = true;
  private interval: any;

  constructor(private routes: Router, private userService: UserService,private otpService : OtpService,private toastr: ToastrService,private spinner: NgxSpinnerService) {
    this.registrationForm = new FormGroup(
      {
        email: new FormControl('', [Validators.required, Validators.email]),
        username: new FormControl('', [
          Validators.required,
          noWhitespaceOrDiacritics(),
        ]),
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(6),
        ]),
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
  apiResponseBody: ApiResponseBody | null = null;
  apiResponse: HttpResponse<any> | null = null;

  onSubmit(): void {
    if (this.registrationForm.valid) {
      const email = this.registrationForm.value.email;
      this.checkEmail(email).subscribe((check_email) => {
        if (check_email == true) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Email existed!',
          });
        } else {
          const username = this.registrationForm.value.username;
          this.checkUsername(username).subscribe((check_username) => {
            if (check_username == true) {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Username existed!',
              });
            } else {
              if(this.usingOTP ===true){
                this.OTP();
              }
              else{
                this.NO_OTP();
              }

            }
          });
        }
      });
    }
  }

  checkEmail(email: string): Observable<boolean> {
    return this.userService.getUserByEmail(email).pipe(
      map((response) => {
        this.apiResponseBody = response.body;
        return this.apiResponseBody?.code === 200;
      })
    );
  }
  checkUsername(username: string): Observable<boolean> {
    return this.userService.getUserByUsername(username).pipe(
      map((response) => {
        this.apiResponseBody = response.body;
        return this.apiResponseBody?.code === 200;
      })
    );
  }

  checkRegist(form: any): Observable<boolean> {
    return this.userService.createUser(form).pipe(
      map((response) => {
        this.apiResponseBody = response.body;
        return this.apiResponseBody?.code === 200;
      })
    );
  }

  requestOtp(email :string):Observable<boolean>{
    const req ={
      "email":email
    }
    return  this.otpService.requestOtp(req).pipe(
      map((res)=>{
        this.apiResponseBody = res;
        return this.apiResponseBody?.code === 200;
      })
    );
  }

  verifyOtp(email :string,otp:string){
    const req ={
      "email":email,
      "otp":otp
    }
    return  this.otpService.verifyOtp(req).pipe(
      map((res)=>{
        this.apiResponseBody = res;
        return this.apiResponseBody?.code === 200;
      })
    );
  }


  //Đăng ký có OTP
  OTP(){
    this.spinner.show("load");
    this.requestOtp(this.registrationForm.value.email).subscribe((reqOtp)=>{
      const email =this.registrationForm.value.email;
         if(reqOtp==true){
          this.spinner.hide("load");
          this.toastr.success(`Otp sent to ${email}`, 'Notification', {
            closeButton: true,
            progressBar: true,
            positionClass: 'toast-top-right',
          });
          this.openForm();
         }else{
          this.toastr.error('There was an error sending otp', 'Notification', {
            closeButton: true,
            progressBar: true,
            positionClass: 'toast-top-right',
          });
         }

    });

  }
  //Đăng ký ko dùng OTP
  NO_OTP(){
    const formData = {
      email: this.registrationForm.value.email,
      username: this.registrationForm.value.username,
      password: this.registrationForm.value.password,
    };
    this.checkRegist(formData).subscribe((check_regist) => {
      if (check_regist == true) {
        Swal.fire({
          icon: 'success',
          title: 'Successful',
          text: 'Account created successfully',
        });

        setTimeout(()=>{
           this.isFormOpen=false;
        },2000)
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Opp..',
          text: 'Have error during process registration',
        });
      }
    });
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
  RegistrationForm() {
   this.verifyOtp(this.registrationForm.value.email,this.otp).subscribe(otp =>{
    if(otp===true){
      const formData = {
        email: this.registrationForm.value.email,
        username: this.registrationForm.value.username,
        password: this.registrationForm.value.password,
      };
      this.checkRegist(formData).subscribe((check_regist) => {
        if (check_regist == true) {
          Swal.fire({
            icon: 'success',
            title: 'Successful',
            text: 'Account created successfully',
          });

          setTimeout(()=>{
             this.isFormOpen=false;
          },2000)
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Opp..',
            text: 'Have error during process registration',
          });
        }
      });
    }
    else{
      Swal.fire({
        icon: 'error',
        title: 'Opp..',
        text: 'Otp not correct',
      });
    }
   })
  }

  // Hàm bắt đầu đếm ngược
  startCountdown() {
    // Đặt lại bộ đếm ngược về 10 giây mỗi lần gọi
    this.countdown = 20;
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
    this.spinner.show("load_otp");
    this.requestOtp(this.registrationForm.value.email).subscribe((reqOtp)=>{
      this.spinner.hide("load_otp");
      const email =this.registrationForm.value.email;
         if(reqOtp==true){
          this.spinner.hide("load");
          this.toastr.success(`Otp sent to ${email}`, 'Notification', {
            closeButton: true,
            progressBar: true,
            positionClass: 'toast-top-right',
          });
         }else{
          this.toastr.error('There was an error sending otp', 'Notification', {
            closeButton: true,
            progressBar: true,
            positionClass: 'toast-top-right',
          });
         }

    });
    this.startCountdown();
  }
}

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Route, Router, Routes } from '@angular/router';
import { UserService } from '../Service/User/user.service';
import Swal from 'sweetalert2';
import { AuthService } from '../Service/Authentication/auth.service';
import { HttpResponse } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { ApiResponseBody } from '../interFace/ApiResponseBody';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent implements OnInit {
  //nút ẩn hiện password
  showPassword: boolean = false;
  togglePasswordVisibility() {
  this.showPassword = !this.showPassword;
  }

  images: string[] = [
    'assets/images/LoginPage/Registration.jpg',
    'assets/images/LoginPage/LoginPage.jpg',
    'assets/images/LoginPage/LoginPage_2.jpg',
  ];

  // Biến lưu trữ đường dẫn hình ảnh ngẫu nhiên
  randomImage: string | undefined;

  loginForm:FormGroup;
  constructor(private routes : Router,private userService: UserService,private authService:AuthService,){
    this.loginForm = new FormGroup(
      {
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', Validators.required)
      }
    );
  }

  ngOnInit(): void {
    this.setRandomImage();
  }

  apiResponseBody:  ApiResponseBody | null = null;
  apiResponse : HttpResponse<any> |null =null;
  loginResponse: {userid:number; email: string; token: string } | null = null;
  onLogin() {
    if (this.loginForm.valid) {
      const email = this.loginForm.value.email;
      //Check tài khoản tồn tại không
      this.checkEmail(email).subscribe(check_email => {
      //Check mật khẩu
        if(check_email==true){
          this.checkLogin(this.loginForm.value).subscribe(check_password =>{
            if(check_password==true){
              this.routes.navigate(['/Dashboard']);
            }
            else{
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Password is not correct!",
              });
            }
          })
        }
        else{
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Email is not registered",
          });
        }
      });
    }
  }

      checkEmail(email: string): Observable<boolean> {
        return this.userService.getUserByEmail(email).pipe(
          map(response => {
            this.apiResponseBody = response.body;
            return this.apiResponseBody?.code === 200; // Trả về true nếu code là 200
          })
        );
      }
      checkLogin(form :any):Observable<boolean>{
        return this.authService.callApiLogin(form).pipe(
          map(response =>{
            this.apiResponseBody = response.body;
            this.loginResponse = this.apiResponseBody?.data;
            console.log(this.loginResponse?.userid);
            if(this.loginResponse){
              const user= JSON.stringify(this.loginResponse);
              sessionStorage.setItem('session_user',user);
            }
            return this.apiResponseBody?.code === 200;
          })
        );
      }
  // Chọn ngẫu nhiên một hình ảnh
  setRandomImage(): void {
    const randomIndex = Math.floor(Math.random() * this.images.length);
    this.randomImage = this.images[randomIndex];
  }

}

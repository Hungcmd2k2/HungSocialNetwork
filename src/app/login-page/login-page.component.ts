import { Component, OnInit } from '@angular/core';
import { Route, Router, Routes } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent implements OnInit {
  constructor(private routes : Router){}
  onLogin() {
     this.routes.navigate(['/Dashboard']);
  }
  images: string[] = [
    'assets/images/LoginPage/Registration.jpg',
    'assets/images/LoginPage/LoginPage.jpg',
    'assets/images/LoginPage/LoginPage_2.jpg',
  ];

  // Biến lưu trữ đường dẫn hình ảnh ngẫu nhiên
  randomImage: string | undefined;

  ngOnInit(): void {
    this.setRandomImage();
  }

  // Chọn ngẫu nhiên một hình ảnh
  setRandomImage(): void {
    const randomIndex = Math.floor(Math.random() * this.images.length);
    this.randomImage = this.images[randomIndex];
  }
}

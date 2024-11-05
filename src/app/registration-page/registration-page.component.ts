import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-registration-page',
  templateUrl: './registration-page.component.html',
  styleUrl: './registration-page.component.css'
})
export class RegistrationPageComponent implements OnInit {
  onLogin() {
    // Xử lý logic đăng nhập tại đây
    //console.log('Form has been submitted');
    alert('Form has been submitted');
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

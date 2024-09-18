import { Component } from '@angular/core';

@Component({
  selector: 'app-myself',
  templateUrl: './myself.component.html',
  styleUrl: './myself.component.css'
})
export class MyselfComponent {
 // Hàm để mở ảnh toàn màn hình
 openFullscreen(imageSrc: string) {
  const overlay = document.getElementById("fullscreenOverlay") as HTMLElement;
  const fullscreenImage = document.getElementById("fullscreenImage") as HTMLImageElement;

  // Cập nhật nguồn của ảnh toàn màn hình
  fullscreenImage.src = imageSrc;

  // Hiển thị overlay
  overlay.style.display = "flex";
}

// Hàm để đóng overlay
closeFullscreen() {
  const overlay = document.getElementById("fullscreenOverlay") as HTMLElement;

  // Ẩn overlay
  overlay.style.display = "none";
}
}

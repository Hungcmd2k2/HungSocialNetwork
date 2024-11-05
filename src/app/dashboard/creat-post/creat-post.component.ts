import { Component } from '@angular/core';

@Component({
  selector: 'app-creat-post',
  templateUrl: './creat-post.component.html',
  styleUrl: './creat-post.component.css'
})
export class CreatPostComponent {
  fileInfo: string[] = []; // Mảng lưu thông tin tệp

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        this.fileInfo = []; // Xóa thông tin cũ

        if (input.files) {
            for (let i = 0; i < input.files.length; i++) {
                const file = input.files[i];
                this.fileInfo.push(`Tên tệp: ${file.name}, Kích thước: ${file.size} bytes, Kiểu: ${file.type}`);
            }
        }
    }
}

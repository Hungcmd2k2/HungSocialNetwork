import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.css'
})
export class SettingComponent implements AfterViewInit {
  @ViewChild('messageInput') messageInput!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('chatContainer') chatContainer!: ElementRef<HTMLDivElement>;
  ngAfterViewInit(): void {
    // Tự động focus vào textarea khi view được render
    this.focusTextarea();
    this.scrollToBottom();
  }

  focusTextarea(): void {
    if (this.messageInput) {
      this.messageInput.nativeElement.focus();
    }
  }

  scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Scroll to bottom failed', err);
    }
  }
}

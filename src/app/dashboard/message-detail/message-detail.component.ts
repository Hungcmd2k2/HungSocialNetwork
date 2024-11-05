import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-message-detail',
  templateUrl: './message-detail.component.html',
  styleUrl: './message-detail.component.css',
})
export class MessageDetailComponent implements AfterViewInit {
  constructor(private router: Router) {}
  @ViewChild('chatBox') private chatBox!: ElementRef;
  ngAfterViewInit(): void {
    this.scrollToBottom();
  }
  scrollToBottom(): void {
    const element = this.chatBox.nativeElement;
    element.scrollTop = element.scrollHeight;
  }

  backMess(){
    this.router.navigate(['/Dashboard/Message']);
  }
}

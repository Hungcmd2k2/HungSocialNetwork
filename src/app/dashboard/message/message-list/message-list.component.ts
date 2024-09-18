import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.css'
})
export class MessageListComponent {
  constructor(private router: Router) {}
  goMessDetail(){
    this.router.navigate(['Dashboard/Message/detail']);
  }
}

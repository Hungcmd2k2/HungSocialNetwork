import { Injectable } from '@angular/core';
import { Client, Message, Stomp, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Observable, Subject } from 'rxjs';
import { ChatMessage } from '../../interFace/chat-message';
import { ChatFormRealTime } from '../../interFace/ChatFormRealTime';
import { environment } from '../Config/environment';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private stompClient: any;
  private url =environment.apiUrl;
  private apiUrl = this.url + '/chat-socket';
  constructor( private toastr : ToastrService) {

  }

  // Khởi tạo kết nối WebSocket
  initConnectionSocket() {
    this.stompClient = Stomp.over(() => new SockJS(this.apiUrl));
  }

  // Tham gia vào một room cụ thể
  joinRoom(roomId: String ,messageCallback: (messageContent: any) => void) {
    // Kết nối WebSocket
    this.stompClient.connect({}, (frame: any) => {
      console.log('Connected: ' + frame);

      // Tham gia vào room và lắng nghe tin nhắn
      this.stompClient.subscribe(`/topic/${roomId}`, (message: any) => {
        const messageContent = JSON.parse(message.body);
        console.log('Received:', messageContent);
        messageCallback(messageContent);
      });
    }, (error: string) => {
      console.error('WebSocket connection error:', error);
    });
  }



  // Gửi tin nhắn đến một room cụ thể
  sendMessage(roomId: String, chatMessage: ChatFormRealTime) {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.send(
        `/app/chat/${roomId}`,
        {},
        JSON.stringify(chatMessage)
      );
    } else {
      console.error('WebSocket is not connected.');
    }
  }
}

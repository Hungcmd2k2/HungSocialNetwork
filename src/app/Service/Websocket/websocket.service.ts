import { Injectable } from '@angular/core';
import { Client, Message, Stomp, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Observable, Subject } from 'rxjs';
import { ChatMessage } from '../../interFace/chat-message';
import { ChatFormRealTime } from '../../interFace/ChatFormRealTime';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private stompClient: any;

  constructor() {

  }

  // Khởi tạo kết nối WebSocket
  initConnectionSocket() {
    const url = 'http://localhost:8080/chat-socket';
    this.stompClient = Stomp.over(() => new SockJS(url));
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

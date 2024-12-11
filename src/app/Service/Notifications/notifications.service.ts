import { Injectable, OnInit } from '@angular/core';
import { environment } from '../Config/environment';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { ToastrService } from 'ngx-toastr';
import { map, Observable } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService implements OnInit {
  private stompClient: any;
  private url = environment.apiUrl;
  private apiUrl = this.url + '/ws-notifications';
  constructor(private toastr: ToastrService,private http: HttpClient) {}
  ngOnInit(): void {

  }

  initConnectionSocket(topic :string) {
    if (this.stompClient && this.stompClient.connected) {
      console.log('WebSocket đã được kết nối.');
      return;
    }
    console.log('Đang khởi tạo kết nối WebSocket...');
    this.stompClient = Stomp.over(() => new SockJS(this.apiUrl));
    // Kết nối WebSocket
    this.stompClient.connect(
      {},
      () => {
        console.log('Kết nối WebSocket thành công.');
        this.JoinNofification(topic);
      },
      (error: any) => {
        console.error('Kết nối WebSocket thất bại:', error);
      }
    );
  }

  JoinNofification(topic : string) {
    this.stompClient.subscribe(`/topic/${topic}`, (message: any) => {
      const chatMessage = JSON.parse(message.body);

      const mess =chatMessage.usernameNotifi + chatMessage.content

      this.toastr.info(mess, 'Notification', {
        closeButton: true,
        progressBar: true,
      });
      console.log('Received:',chatMessage.content);
    });
  }

  getNotifiByUserid(userid: number): Observable<any> {
    return this.http.get<HttpResponse<any>>(`${this.url}/api/notifications/${userid}`,{observe:'response'}).pipe(
      map((response) => response.body)
    );
  }
}

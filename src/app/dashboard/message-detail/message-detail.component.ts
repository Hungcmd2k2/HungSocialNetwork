import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ChangeDetectorRef
} from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { WebSocketService } from '../../Service/Websocket/websocket.service';
import { ChatMessage } from '../../interFace/chat-message';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from '../../Service/Message/message.service';
import { ChatroomService } from '../../Service/ChatRoom/chatroom.service';
import { ApiResponseBody } from '../../interFace/ApiResponseBody';
import { UserService } from '../../Service/User/user.service';
import { UserProfileOther } from '../../interFace/UserOtherInfo';
@Component({
  selector: 'app-message-detail',
  templateUrl: './message-detail.component.html',
  styleUrl: './message-detail.component.css',
})
export class MessageDetailComponent implements AfterViewInit, OnInit {
  @ViewChild('messageInput') messageInput!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('chatContainer') chatContainer!: ElementRef<HTMLDivElement>;
  userObject: any;
  userReceiverInfo :UserProfileOther[] =[];
  senderId: number = 0;
  receiverId: number = 0;
  ROOM_ID:string ='';
  ROOM_ID_PHU:string ='ABCD';
  newMessage: string = '';
  messages: ChatMessage[] = []; // Mảng lưu các tin nhắn
  apiResponseBody: ApiResponseBody | null = null;
  constructor(
    private chatRoomService: ChatroomService,
    private chatService: WebSocketService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private messService: MessageService,
    private cdr: ChangeDetectorRef,
    private userService :UserService
  ) {
    this.chatService.initConnectionSocket();
    this.Who();
    this.Chat_To_Who();
  }
  Who() {
    const user = sessionStorage.getItem('session_user');
    if (user) {
      this.userObject = JSON.parse(user);
      this.senderId = Number(this.userObject.userid);
    } else {
      this.toastr.error('You are not logged in yet', 'Notification', {
        closeButton: true,
        progressBar: true,
        positionClass: 'toast-top-center',
      });
    }
  }
  ngAfterViewInit(): void {
    this.focusTextarea();
    this.scrollToBottom();
  }

  focusTextarea(): void {
    if (this.messageInput) {
      this.messageInput.nativeElement.focus();
    }
  }

  scrollToBottom(): void {
    setTimeout(() => {
      if (this.chatContainer?.nativeElement) {
        this.chatContainer.nativeElement.scrollTop =
          this.chatContainer.nativeElement.scrollHeight;
      }
      this.cdr.detectChanges();
    }, 300);
  }

  //Chatttttttttttt
  ngOnInit(): void {
    this.CheckRoomID();

  }

  sendMessage() {
    if(this.newMessage.trim()){
      const chatMessage = {
        senderId: this.senderId,
        receiverId: this.receiverId,
        chatId: this.ROOM_ID,
        content: this.newMessage,
      };
      console.log('tao gửi nè: ' + JSON.stringify(chatMessage));
      this.chatService.sendMessage(this.ROOM_ID, chatMessage);
      this.newMessage = '';
      this.scrollToBottom();
    }
    else{
      this.toastr.info('Messeage not null', 'Notification', {
        closeButton: true,
        progressBar: true,
        positionClass: 'toast-top-right',
      });
    }

  }
  //Chat đến ai
  Chat_To_Who() {
    this.route.params.subscribe((params) => {
      this.receiverId = params['userId'];
    });
    this.userService.getUserdetail(this.receiverId).subscribe(res =>{
      this.apiResponseBody=res;
       if(this.apiResponseBody?.code===200){
        this.userReceiverInfo.push(this.apiResponseBody.data);
       }
    })

  }
  //Check room id của 2 user
  CheckRoomID(){
    const formGetRoomID ={
      useroneId:this.senderId,
      usertwoId:this.receiverId
    }

    this.chatRoomService.CheckRoomID(formGetRoomID).subscribe(res =>{
      this.apiResponseBody=res;
      if(this.apiResponseBody?.code===200){
        this.ROOM_ID =this.apiResponseBody.data;
        console.log("Room_ID:"+this.ROOM_ID);
        console.log('gọi hàm join room');
        this.chatService.joinRoom(this.ROOM_ID, (messageContent: any) => {
        this.messages.push(messageContent);
        this.scrollToBottom();
    });
      this.getAllMessHistory(this.ROOM_ID);

      }else{
        this.CreateRoomID();
      }

    })
  }
  //Hàm tạo room ID
  CreateRoomID(){
    const formGetRoomID ={
      useroneId:this.senderId,
      usertwoId:this.receiverId
    }
    this.chatRoomService.CreateRoomID(formGetRoomID).subscribe(res=>{
    this.apiResponseBody=res;
    if(this.apiResponseBody?.code===200){
      this.ROOM_ID=this.apiResponseBody.data;
      console.log("TAO ROOM MOI THANH CONG");
      console.log("Room_ID:"+this.ROOM_ID);
    }
    else{
      console.log("TAO ROOM KO THANH CONG");
    }
    })

  }
  //Hàm lấy về lịch sử của cuộc  trò chuyện
  getAllMessHistory(chatRoomID: string) {
    this.messService.getAllMessForRoom(chatRoomID).subscribe((response) => {
      this.apiResponseBody=response;
      this.messages=this.apiResponseBody?.data;
      this.scrollToBottom();
    });
  }
}

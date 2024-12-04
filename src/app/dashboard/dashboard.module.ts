import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard.component';
import { MessageComponent } from './message/message.component';
import { NotificationComponent } from './notification/notification.component';
import { FriendComponent } from './friend/friend.component';
import { CreatPostComponent } from './creat-post/creat-post.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CallOnInitDirective } from './directives/call-on-init.directive';



@NgModule({
  declarations: [
    HomeComponent,
    DashboardComponent,
    MessageComponent,
    NotificationComponent,
    FriendComponent,
    CreatPostComponent,
    CallOnInitDirective,



  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    NgxSpinnerModule,

  ],

})
export class DashboardModule { }

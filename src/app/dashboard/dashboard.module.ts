import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard.component';
import { MessageComponent } from './message/message.component';
import { NotificationComponent } from './notification/notification.component';
import { FriendComponent } from './friend/friend.component';




@NgModule({
  declarations: [
    HomeComponent,
    DashboardComponent,
    MessageComponent,
    NotificationComponent,
    FriendComponent,


  ],
  imports: [
    CommonModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }

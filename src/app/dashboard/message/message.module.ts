import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessageRoutingModule } from './message-routing.module';
import { MessageListComponent } from './message-list/message-list.component';
import { FormsModule } from '@angular/forms';
import { MessageDetailComponent } from '../message-detail/message-detail.component';


@NgModule({
  declarations: [
    MessageListComponent,
    MessageDetailComponent
  ],
  imports: [
    CommonModule,
    MessageRoutingModule,
    FormsModule
  ]
})
export class MessageModule { }

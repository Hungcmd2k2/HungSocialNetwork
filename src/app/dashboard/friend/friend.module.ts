import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FriendRoutingModule } from './friend-routing.module';
import { InvitationComponent } from './invitation/invitation.component';
import { MyfriendComponent } from './myfriend/myfriend.component';
import { SearchComponent } from './search/search.component';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [
    InvitationComponent,
    MyfriendComponent,
    SearchComponent
  ],
  imports: [
    CommonModule,
    FriendRoutingModule,
    NgxSpinnerModule,
    FormsModule
  ]
})
export class FriendModule { }

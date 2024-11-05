import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FriendRoutingModule } from './friend-routing.module';
import { InvitationComponent } from './invitation/invitation.component';
import { MyfriendComponent } from './myfriend/myfriend.component';
import { SearchComponent } from './search/search.component';


@NgModule({
  declarations: [
    InvitationComponent,
    MyfriendComponent,
    SearchComponent
  ],
  imports: [
    CommonModule,
    FriendRoutingModule
  ]
})
export class FriendModule { }

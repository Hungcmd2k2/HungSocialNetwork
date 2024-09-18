import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { MyselfComponent } from './myself/myself.component';
import { EditComponent } from './edit/edit.component';
import { FriendComponent } from './friend/friend.component';
import { ProfileComponent } from './profile.component';


@NgModule({
  declarations: [
    MyselfComponent,
    EditComponent,
    FriendComponent,
    ProfileComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule
  ]
})
export class ProfileModule { }

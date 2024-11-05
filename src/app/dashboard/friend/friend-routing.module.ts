import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FriendComponent } from './friend.component';
import { InvitationComponent } from './invitation/invitation.component';
import { MyfriendComponent } from './myfriend/myfriend.component';
import { SearchComponent } from './search/search.component';

const routes: Routes = [
  {
    path: '',
    component:FriendComponent,
    children:[
      {path:'',redirectTo :'MyFriend',pathMatch:'full'},
      {path:'Invitation',component:InvitationComponent},
      {path:'MyFriend',component:MyfriendComponent},
      {path:'Search',component:SearchComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FriendRoutingModule { }

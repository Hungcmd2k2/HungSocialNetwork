import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard.component';
import { NotificationComponent } from './notification/notification.component';
import { CreatPostComponent } from './creat-post/creat-post.component';





const routes: Routes = [
  {path: '',
    component: DashboardComponent,
    children:[
      {
        path: 'Home',
        component:HomeComponent
      },
      {
        path: 'Message',
        loadChildren:()=>import('./message/message.module').then(m=>m.MessageModule)
      },
      {
        path: 'Notification',
        component:NotificationComponent
      },
      {
        path:'Creat-Post',
        component:CreatPostComponent
      },
      {path: 'Friend',loadChildren: () => import('./friend/friend.module').then(m => m.FriendModule) },
      {path:'Profile',loadChildren:()=>import('./profile/profile.module').then(m=>m.ProfileModule)}

    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { MyselfComponent } from './myself/myself.component';
import { EditComponent } from './edit/edit.component';
import { UserOtherComponent } from './user-other/user-other/user-other.component';
import { EditPostComponent } from './edit-post/edit-post.component';

const routes: Routes = [
  {path:'',
    component:ProfileComponent,
    children:[
      {
        path:'Myself',component:MyselfComponent
      },
      {
        path:'Edit',component:EditComponent
      },
      {
        path:'user-other/:username',component:UserOtherComponent
      },
      {
        path:'',redirectTo:'Myself',pathMatch:'full'
      },
      {
        path:'edit-post/:postId',component:EditPostComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }

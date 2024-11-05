import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { MyselfComponent } from './myself/myself.component';
import { EditComponent } from './edit/edit.component';

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
        path:'',redirectTo:'Myself',pathMatch:'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }

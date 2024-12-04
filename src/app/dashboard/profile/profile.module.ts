import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { MyselfComponent } from './myself/myself.component';
import { EditComponent } from './edit/edit.component';
import { ProfileComponent } from './profile.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { UserOtherComponent } from './user-other/user-other/user-other.component';
import { ChecklikeDirective } from './directives_Profile/checklike.directive';
@NgModule({
  declarations: [
    MyselfComponent,
    EditComponent,
    ProfileComponent,
    UserOtherComponent,
    ChecklikeDirective
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ProfileModule { }

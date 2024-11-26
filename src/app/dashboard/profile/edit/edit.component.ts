import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../../Service/User/user.service';
import { ApiResponseBody } from '../../../interFace/ApiResponseBody';
import { EditFormRES } from '../../../interFace/EditFormRES';
import { passwordMatchValidator } from '../../../Validator/password-match';
import { AuthService } from '../../../Service/Authentication/auth.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  public userObject: any = null;
  profileForm: FormGroup;
  editPasswordForm: FormGroup;
  editFormResponse: EditFormRES | null = null;
  apiResponse: ApiResponseBody | null = null;
  nameAccount :any;

  checkpassWordCurent: { userid: number; password: string } = {
    userid:0,
    password: ''
  };
  updatePassNew:{ userid: number; password: string } = {
    userid:0,
    password: ''
  };

  constructor(private toastr: ToastrService, private userService: UserService,private authService: AuthService) {
    this.profileForm = new FormGroup({
      userid: new FormControl(''),
      fullname: new FormControl('', [Validators.required]),
      dob: new FormControl('', [Validators.required]),
      linksocial: new FormControl('', [Validators.required]),
      lovesong: new FormControl('', [Validators.required]),
      education: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
    });

    this.editPasswordForm = new FormGroup({
      currentPassword: new FormControl('',[Validators.required]),
      newPassword:new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword:new FormControl('', [Validators.required])
    },
    { validators: passwordMatchValidator('newPassword', 'confirmPassword') }

  );

}

  ngOnInit() {
    this.Who();
  }
  SaveNewPassword(): void {
    if (this.editPasswordForm.valid) {
      console.log('Form Submitted:', this.editPasswordForm.value);
      this.checkpassWordCurent.userid=this.userObject.userid;
      this.checkpassWordCurent.password=this.editPasswordForm.value.currentPassword;
      this.authService.checkPassword(this.checkpassWordCurent).subscribe(response =>{
        this.apiResponse = response;
        if(this.apiResponse?.code===200){
            this.updatePassNew.userid=this.userObject.userid;
            this.updatePassNew.password=this.editPasswordForm.value.confirmPassword
          this.userService.updatePassword(this.updatePassNew).subscribe(response =>{
            this.apiResponse=response;
            if(this.apiResponse?.code===200){
              this.editPasswordForm.reset();
              console.log(this.apiResponse);
           this.toastr.success('Password update successful', 'Notification', {
            closeButton: true,
            progressBar: true
          });
            }
            else{
              console.log(this.apiResponse);
              this.toastr.error('Password not update successful', 'Notification', {
                closeButton: true,
                progressBar: true
              });
            }

          })

        }else{
          this.toastr.error('Password current not cornect', 'Notification', {
            closeButton: true,
            progressBar: true
          });
        }
      })
    }
  }
  Who() {
    const user = sessionStorage.getItem('session_user');
    if (user) {
      // Chuyển chuỗi JSON thành object
      this.userObject = JSON.parse(user);
      this.getUserDetail();
    } else {
      this.showNotification();
    }
  }

  showNotification(): void {
    this.toastr.warning('You are not logged in yet', 'Notification', {
      closeButton: true,
      progressBar: true
    });
  }

  setValue_EditForm() {
    this.nameAccount=this.editFormResponse?.fullname;
    if (this.editFormResponse) {
      this.profileForm.setValue({
        userid: this.editFormResponse.userid,
        fullname: this.editFormResponse.fullname,
        dob: this.editFormResponse.dob,
        linksocial: this.editFormResponse.linksocial,
        lovesong: this.editFormResponse.lovesong,
        education: this.editFormResponse.education,
        address: this.editFormResponse.address
      });
    }
  }

  // Xử lý nút Save
  saveForm() {
    if (this.profileForm.valid) {
      console.log('Form Data:', this.profileForm.value);
      this.userService.updateUserdetail(this.profileForm.value).subscribe(response => {
        this.apiResponse = response.body;
        if (this.apiResponse?.code === 400) {
          this.toastr.error('Unable to update user', 'Notification', {
            closeButton: true,
            progressBar: true
          });
        } else {
          this.toastr.success('User updated successfully', 'Notification', {
            closeButton: true,
            progressBar: true
          });
        }
      });
    } else {
      alert('Form không hợp lệ');
    }
  }

  resetForm() {
    this.profileForm.reset();
  }

  getUserDetail() {
    this.userService.getUserdetail(this.userObject.userid).subscribe(response => {
      this.apiResponse = response;
      this.editFormResponse = this.apiResponse?.data;
      console.log(this.editFormResponse);

      // Chỉ gọi setValue_EditForm khi dữ liệu đã có
      this.setValue_EditForm();
    });
  }
}

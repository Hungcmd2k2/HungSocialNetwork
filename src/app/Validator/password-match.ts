import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Custom validator để so sánh password và conf_password
export function passwordMatchValidator(password: string, confirmPassword: string): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const passwordControl = formGroup.get(password);
    const confirmPasswordControl = formGroup.get(confirmPassword);

    if (passwordControl && confirmPasswordControl) {
      const isMatch = passwordControl.value === confirmPasswordControl.value;
      return isMatch ? null : { passwordMismatch: true };
    }
    return null;
  };
}

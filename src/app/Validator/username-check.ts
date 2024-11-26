import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function noWhitespaceOrDiacritics(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value || '';
    // Kiểm tra khoảng trắng
    const hasWhitespace = /\s/.test(value);
    // Kiểm tra ký tự có dấu (Unicode) bằng cách so sánh với bản không dấu
    const hasDiacritics = value !== value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (hasWhitespace || hasDiacritics) {
      return { invalidUsername: true }; // Trả lỗi nếu có khoảng trắng hoặc dấu
    }
    return null; // Không lỗi
  };
}

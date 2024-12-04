import { Directive, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appCallOnInit]'
})
export class CallOnInitDirective implements OnInit {

  @Input('appCallOnInit') callback?: () => void; // Cho phép undefined

  ngOnInit(): void {
    if (this.callback) {
      this.callback();
    } else {
      console.warn('Callback không được cung cấp.');
    }
  }

}

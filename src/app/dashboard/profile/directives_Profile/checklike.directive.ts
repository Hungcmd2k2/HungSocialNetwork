import { Directive, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appChecklike]'
})
export class ChecklikeDirective implements OnInit {

  @Input('appChecklike') callback?: () => void; // Cho phép undefined

  ngOnInit(): void {
    if (this.callback) {
      this.callback();
    } else {
      console.warn('Callback không được cung cấp.');
    }
  }

}

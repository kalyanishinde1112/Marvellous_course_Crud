import { Directive, HostListener } from '@angular/core';
import { ElementRef } from '@angular/core';
@Directive({
  selector: '[appMarvellous]',
  standalone: true
})
export class MarvellousDirective {

  constructor(private obj:ElementRef) {
   }
@HostListener('mouseenter') onmouseenter(){
  this.obj.nativeElement.style.backgorund='blue';

}
@HostListener('mouseleave') onmouseleave(){
  this.obj.nativeElement.style.backgorund='red';
}
}

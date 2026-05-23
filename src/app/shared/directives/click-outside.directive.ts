import { Directive, ElementRef, inject, HostListener, output, DestroyRef } from '@angular/core';

@Directive({
  selector: '[clickOutside]'
})
export class ClickOutsideDirective {
  private elementRef = inject(ElementRef);

  clickOutside = output<void>();

  @HostListener('document:click', ['$event'])
  @HostListener('document:touchstart', ['$event'])
  onClick(event: Event) {
    const isOutside = !this.elementRef.nativeElement.contains(event.target);

    if (isOutside) {
      this.clickOutside.emit();
    }
  }
}

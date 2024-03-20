import {Directive, ElementRef, HostBinding, Input, OnInit} from "@angular/core";

@Directive({
  selector: '[appLoadingSpinner]'
})
export class LoadingSpinnerDirective implements OnInit{
  @Input() width: string = '64px';
  @Input() height: string = '64px';
  @Input() borderColor: string = 'gray';
  constructor(private accessChild: ElementRef<HTMLElement | any>) {
  }
  ngOnInit() {
    const selectAllChild = this.accessChild.nativeElement.querySelectorAll('div');
    for (let i = 0; i < selectAllChild.length; i++) {
      selectAllChild[i].style.width = this.width;
      selectAllChild[i].style.height = this.height;
      selectAllChild[i].style.borderColor = `${this.borderColor} transparent transparent transparent`
    }
  }
}

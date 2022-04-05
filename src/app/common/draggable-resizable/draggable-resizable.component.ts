import {AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, ViewChild} from '@angular/core';

const enum Status {
  OFF = 0,
  RESIZE = 1,
  MOVE = 2
}


@Component({
  selector: 'app-draggable-resizable',
  templateUrl: './draggable-resizable.component.html',
  styleUrls: ['./draggable-resizable.component.scss'],
})
export class DraggableResizableComponent implements OnInit, AfterViewInit {

  @Input('width') public width: number;
  @Input('height') public height: number;
  @Input('left') public left: number;
  @Input('top') public top: number;
  @ViewChild("box", {static: true}) public box: ElementRef;
  private boxPosition: { left: number, top: number };
  private containerPos: { left: number, top: number, right: number, bottom: number };
  public mouse: {x: number, y: number}
  public status: Status = Status.OFF;
  private mouseClick: {x: number, y: number, left: number, top: number}
  //
  // @HostListener('window:mousemove', ['$event'])
  // onMouseMove(event: MouseEvent){
  //   this.mouse = { x: event.clientX, y: event.clientY };
  //   console.log('mouse coords', this.mouse)
  //
  //   if(this.status === Status.RESIZE) this.resize();
  //   else if(this.status === Status.MOVE) this.move();
  // }

  ngOnInit() {}

  ngAfterViewInit(){
    this.loadBox();
    this.loadContainer();
  }

  private loadBox(){
    const {left, top} = this.box.nativeElement.getBoundingClientRect();
    this.boxPosition = {left, top};
    console.log('boxPosition', this.boxPosition);


  }

  catchMouseMove(event) {

    this.mouse = { x: event.clientX, y: event.clientY };
    //console.log('mouse move coords', this.mouse)

    if(this.status === Status.RESIZE) this.resize();
    else if(this.status === Status.MOVE) this.move();
  }

  private loadContainer(){
    const left = this.boxPosition.left - this.left;
    const top = this.boxPosition.top - this.top;
    const right = left + 600;
    const bottom = top + 450;
    this.containerPos = { left, top, right, bottom };
    console.log('containerPos --->', this.containerPos);
  }

  setStatus(event: MouseEvent, status: number){

    event.stopPropagation();
     if(status === 2) this.mouseClick = { x: event.clientX, y: event.clientY, left: this.left, top: this.top };
    else this.loadBox();  this.loadContainer();
    this.status = status;

  }



  private resize(){
    if(this.resizeCondMeet()){
      this.width = Number(this.mouse.x > this.boxPosition.left) ? this.mouse.x - this.boxPosition.left : 0;
      this.height = Number(this.mouse.y > this.boxPosition.top) ? this.mouse.y - this.boxPosition.top : 0;

      //this.height = this.width;
    }

    // if(this.resizeCondMeet()){
    //   this.width = this.mouse.x - this.boxPosition.left;
    //   this.height = this.mouse.y - this.boxPosition.top;
    // }
  }

  private resizeCondMeet(){
    //return true;
    console.log('mouse x --->', this.mouse.x);
    console.log('containerPos right -->', this.containerPos.right);
    console.log('mouse y --->', this.mouse.y);
    console.log('containerPos botton -->', this.containerPos.bottom);
    console.log('resizeCondMeet', (this.mouse.x < this.containerPos.right && this.mouse.y < this.containerPos.bottom));

    return (this.mouse.x < this.containerPos.right && this.mouse.y < this.containerPos.bottom);

  }

  private move(){
    if(this.moveCondMeet()){
      this.left = this.mouseClick.left + (this.mouse.x - this.mouseClick.x);
      this.top = this.mouseClick.top + (this.mouse.y - this.mouseClick.y);
    }

  }

  private moveCondMeet(){
    //return true;
    const offsetLeft = this.mouseClick.x - this.boxPosition.left;
    const offsetRight = this.width - offsetLeft;
    const offsetTop = this.mouseClick.y - this.boxPosition.top;
    const offsetBottom = this.height - offsetTop;
    return (
      this.mouse.x > this.containerPos.left + offsetLeft &&
      this.mouse.x < this.containerPos.right - offsetRight &&
      this.mouse.y > this.containerPos.top + offsetTop &&
      this.mouse.y < this.containerPos.bottom - offsetBottom
    );
  }

}

import {AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, ViewChild} from '@angular/core';

const enum Status {
  OFF = 0,
  RESIZE = 1,
  MOVE = 2
}

export interface DraggObjProperties {
  id: number;
  width: number;
  height: number;
  left: number;
  top: number;
  boxPosition: {
    left: number;
    top: number;
  },
  containerPost: {
    left: number;
    top: number;
    right: number;
    bottom: number;
  }
}


@Component({
  selector: 'app-draggable-resizable',
  templateUrl: './draggable-resizable.component.html',
  styleUrls: ['./draggable-resizable.component.scss'],
})
export class DraggableResizableComponent implements OnInit, AfterViewInit {

  @Input() public objWidth: number;
  @Input() public objHeight: number;
  @Input() public objLeft: number;
  @Input() public objTop: number;
  @Input() public objLimitWidth: number;
  @Input() public objLimitHeight: number;

  @ViewChild("box", {static: true}) public box: ElementRef;
  private boxPosition: { left: number, top: number };
  private containerPos: { left: number, top: number, right: number, bottom: number };
  public mouse: {x: number, y: number}
  public status: Status = Status.OFF;
  private mouseClick: {x: number, y: number, left: number, top: number}

  public draggableObj: DraggObjProperties = null;
  public draggObjKey = 'draggObj';
  ngOnInit() {
    if (localStorage.getItem(this.draggObjKey)) {
      this.draggableObj = JSON.parse(localStorage.getItem(this.draggObjKey));
      this.objWidth = this.draggableObj.width;
      this.objHeight = this.draggableObj.height;
      this.objLeft = this.draggableObj.left;
      this.objTop = this.draggableObj.top;
      this.boxPosition = this.draggableObj.boxPosition;
      this.containerPos = this.draggableObj.containerPost;
    }
  }

  ngAfterViewInit(){
    this.loadBox();
    this.loadContainer();
  }

  private loadBox(){
    const {left, top} = this.box.nativeElement.getBoundingClientRect();
    this.boxPosition = {left, top};
    console.log('boxPosition', this.boxPosition);
  }

  private loadContainer(){
    const left = this.boxPosition.left - this.objLeft;
    const top = this.boxPosition.top - this.objTop;
    const right = left + this.objLimitWidth;
    const bottom = top + this.objLimitHeight;
    this.containerPos = { left, top, right, bottom };
    console.log('containerPos --->', this.containerPos);
  }

  setStatus(event: MouseEvent, status: number){
    event.stopPropagation();
    if(status === 2) this.mouseClick = { x: event.clientX, y: event.clientY, left: this.objLeft, top: this.objTop };
    else this.loadBox();  this.loadContainer();
    this.status = status;
  }

  catchMouseMove(event) {
    this.mouse = { x: event.clientX, y: event.clientY };
    if(this.status === Status.RESIZE) this.resize();
    else if(this.status === Status.MOVE) this.move();

  }

  saveCoords() {
    this.draggableObj = {
      width: this.objWidth,
      height: this.objHeight,
      containerPost: this.containerPos,
      boxPosition: this.boxPosition,
      id: 1,
      top: this.objTop,
      left: this.objLeft
    }
    localStorage.setItem('draggObj', JSON.stringify(this.draggableObj));
  }



  private resize(){
    if(this.resizeCondMeet()) {
      this.objWidth = Number(this.mouse.x > this.boxPosition.left) ? this.mouse.x - this.boxPosition.left : 0;
      this.objHeight = Number(this.mouse.y > this.boxPosition.top) ? this.mouse.y - this.boxPosition.top : 0;
      this.saveCoords();
    }
  }

  private resizeCondMeet() {
    return (this.mouse.x < this.containerPos.right && this.mouse.y < this.containerPos.bottom);
  }

  private move(){
    if(this.moveCondMeet()) {
      this.objLeft = this.mouseClick.left + (this.mouse.x - this.mouseClick.x);
      this.objTop = this.mouseClick.top + (this.mouse.y - this.mouseClick.y);
      this.saveCoords();
    }
  }

  private moveCondMeet() {
    const offsetLeft = this.mouseClick.x - this.boxPosition.left;
    const offsetRight = this.objWidth - offsetLeft;
    const offsetTop = this.mouseClick.y - this.boxPosition.top;
    const offsetBottom = this.objHeight - offsetTop;
    return (
      this.mouse.x > this.containerPos.left + offsetLeft &&
      this.mouse.x < this.containerPos.right - offsetRight &&
      this.mouse.y > this.containerPos.top + offsetTop &&
      this.mouse.y < this.containerPos.bottom - offsetBottom
    );
  }

}

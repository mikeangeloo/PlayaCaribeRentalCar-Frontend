import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {ActionSheetController, AlertController, ModalController, Platform, PopoverController} from '@ionic/angular';
import {ModelosDocsComponent} from '../components/modelos-docs/modelos-docs.component';
import {ModalDragElementDetailsComponent} from '../components/modal-drag-element-details/modal-drag-element-details.component';

const enum Status {
  OFF = 0,
  RESIZE = 1,
  MOVE = 2
}

export interface DragObjProperties {
  id: any;
  contrato_id: number;
  tipo: number;
  objId: number;
  width: number;
  height: number;
  left: number;
  top: number;
  boxPosition?: {
    left: number;
    top: number;
  },
  containerPost?: {
    left: number;
    top: number;
    right: number;
    bottom: number;
  },
  action?: 'position' | 'remove' | 'changeLevel' | 'photo' | 'addNote' | 'viewMore'
  levelColor?: 'default' | 'warning' | 'danger',
  levelTxt?: string;
  indicatorIcon?: string;
  indicatorTitle?: string;
  notas?: [{
    id?: number;
    nota: string;
    created_at?: string;
    agente_id?: number;
    agente?: string;
    edit?: boolean;
  }];
  enable?: boolean | number;
  lock?: boolean | number;
  saved?: boolean;
  created_at?: string;
  updated_at?: string;
  freeFromDamages?: boolean
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

  @Input() draggableObj: DragObjProperties = null;
  @Input() contract_id: number;
  @Input() dragId: number;
  @Input() type: number;
  @Output() dragObjSaved = new EventEmitter();
  @Output() dragObjSelected = new EventEmitter();

  @ViewChild("box", {static: true}) public box: ElementRef;
  private boxPosition: { left: number, top: number };
  private containerPos: { left: number, top: number, right: number, bottom: number };
  public mouse: {x: number, y: number}
  public status: Status = Status.OFF;
  private mouseClick: {x: number, y: number, left: number, top: number}

  constructor(
    public actionSheetController: ActionSheetController,
    private modalCtr: ModalController,
    private alertController: AlertController,
    public platform: Platform,
  ) {

  }


  ngOnInit() {

    if (this.draggableObj) {
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
    //console.log('boxPosition', this.boxPosition);
  }

  private loadContainer(){
    const left = this.boxPosition.left - this.objLeft;
    const top = this.boxPosition.top - this.objTop;
    const right = left + this.objLimitWidth;
    const bottom = top + this.objLimitHeight;
    this.containerPos = { left, top, right, bottom };
    //console.log('containerPos --->', this.containerPos);
  }

  catchMouseMove(event) {
    if (this.platform.is('desktop')) {
      //console.log('catchMouseMove -->',event);
      this.mouse = { x: event.clientX, y: event.clientY };
      if(this.status === Status.RESIZE) this.resize();
      else if(this.status === Status.MOVE) this.move();
    }
  }

  catchTouchMove(event: TouchEvent) {
    if (!this.platform.is('desktop')) {
      //console.log('catchTouchMove -->',event);
      //console.log('catchTouchMove status --->', this.status);

      this.mouse = { x: event.touches[0].clientX, y: event.touches[0].clientY };
      if(this.status === Status.RESIZE) this.resize();
      else if(this.status === Status.MOVE) this.move();
    }
  }

  setStatus(event: MouseEvent, status: number){
    if (this.platform.is('desktop')) {
      event.stopPropagation();
      if(status === 2) this.mouseClick = { x: event.clientX, y: event.clientY, left: this.objLeft, top: this.objTop };
      else this.loadBox();  this.loadContainer();
      this.status = status;
    }
  }

  setTouchStatus(event: TouchEvent, status: number){
    if (!this.platform.is('desktop')) {
      event.stopPropagation();

      if (status === 0) {
        document.getElementById('drag-container').style.overflow = 'scroll';
        document.getElementById('revisionRowH').style.cssText = '--overflow: auto;'

      } else {
        document.getElementById('drag-container').style.overflow = 'hidden';
        document.getElementById('revisionRowH').style.cssText = '--overflow: hidden;'
      }

      if(status === 2) this.mouseClick = { x: event.touches[0].clientX, y: event.touches[0].clientY, left: this.objLeft, top: this.objTop };
      else this.loadBox();  this.loadContainer();
      this.status = status;
    }
  }



  private resize(){
    if (this.draggableObj.lock === true || this.draggableObj.lock == 1) {
      return;
    }
    if(this.resizeCondMeet()) {
      if (this.mouse.x - this.boxPosition.left <= 20 || this.mouse.y - this.boxPosition.top <= 20 ) {
        return true;
      }
      this.objWidth = Number(this.mouse.x > this.boxPosition.left) ? this.mouse.x - this.boxPosition.left : 0;
      this.objHeight = Number(this.mouse.y > this.boxPosition.top) ? this.mouse.y - this.boxPosition.top : 0;
      this.saveCoords();
    }
  }

  private resizeCondMeet() {
    return (this.mouse.x < this.containerPos.right && this.mouse.y < this.containerPos.bottom);
  }

  private move(){
    if (this.draggableObj.lock === true || this.draggableObj.lock == 1) {
      return;
    }
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

  saveCoords() {
    let randIndex = Math.floor(Math.random() * (100 - 1)) + 1;
    if (this.draggableObj) {
      this.draggableObj.contrato_id = this.contract_id;
      this.draggableObj.tipo = this.type;
      this.draggableObj.width = this.objWidth;
      this.draggableObj.height = this.objHeight;
      this.draggableObj.containerPost = this.containerPos;
      this.draggableObj.boxPosition = this.boxPosition;
      this.draggableObj.top = this.objTop;
      this.draggableObj.left = this.objLeft;
      this.draggableObj.action = 'position';
    } else {
      this.draggableObj = {
        id: null,
        contrato_id: this.contract_id,
        tipo: this.type,
        width: this.objWidth,
        height: this.objHeight,
        containerPost: this.containerPos,
        boxPosition: this.boxPosition,
        objId: randIndex,
        top: this.objTop,
        left: this.objLeft,
        action: 'position',
        levelColor: 'default',
        enable: null

      }
    }

    this.emitSelected(true);
    this.dragObjSaved.emit(this.draggableObj);
  }

  emitSelected(enable: boolean) {
    this.draggableObj.enable = enable;
    this.dragObjSelected.emit(this.draggableObj);
  }

}

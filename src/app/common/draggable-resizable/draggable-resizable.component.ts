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
import {ActionSheetController, ModalController, PopoverController} from '@ionic/angular';
import {ModelosDocsComponent} from '../components/modelos-docs/modelos-docs.component';

const enum Status {
  OFF = 0,
  RESIZE = 1,
  MOVE = 2
}

export interface DragObjProperties {
  id: number;
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
  level?: 'default' | 'warning' | 'danger',
  badge?: string;
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
  @Output() dragObjSaved = new EventEmitter();

  @ViewChild("box", {static: true}) public box: ElementRef;
  private boxPosition: { left: number, top: number };
  private containerPos: { left: number, top: number, right: number, bottom: number };
  public mouse: {x: number, y: number}
  public status: Status = Status.OFF;
  private mouseClick: {x: number, y: number, left: number, top: number}

  constructor(
    public actionSheetController: ActionSheetController,
    private modalCtr: ModalController
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

  private resize(){
    if(this.resizeCondMeet()) {
      if (this.mouse.x - this.boxPosition.left <= 40 || this.mouse.y - this.boxPosition.top <= 40 ) {
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
      this.draggableObj.width = this.objWidth;
      this.draggableObj.height = this.objHeight;
      this.draggableObj.containerPost = this.containerPos;
      this.draggableObj.boxPosition = this.boxPosition;
      this.draggableObj.top = this.objTop;
      this.draggableObj.left = this.objLeft;
      this.draggableObj.action = 'position';
    } else {
      this.draggableObj = {
        width: this.objWidth,
        height: this.objHeight,
        containerPost: this.containerPos,
        boxPosition: this.boxPosition,
        id: randIndex,
        top: this.objTop,
        left: this.objLeft,
        action: 'position',
        level: 'default'
      }
    }

    this.dragObjSaved.emit(this.draggableObj);
  }

  removeObj() {
    this.draggableObj.action = 'remove';
    this.dragObjSaved.emit(this.draggableObj);
  }

  async damageLevelSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Opciones',
      cssClass: 'my-custom-class',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Normal',
          cssClass: 'default',
          handler: () => {
            console.log('Nivel normal clicked');
            this.draggableObj.level = 'default';
            this.dragObjSaved.emit(this.draggableObj);
          },
        },
        {
          text: 'Medio',
          cssClass: 'warning',
          handler: () => {
            console.log('Nivel medio clicked');
            this.draggableObj.level = 'warning';
            this.dragObjSaved.emit(this.draggableObj);
          },
        },
        {
          text: 'Grave',
          cssClass: 'danger',
          handler: () => {
            console.log('Nivel grave clicked');
            this.draggableObj.level = 'danger';
            this.dragObjSaved.emit(this.draggableObj);
          },
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel',
          cssClass: 'action-sheet-cancel',
          handler: () => {
            console.log('Cancel clicked');
          },
        },
      ],
    });
    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  async openModelosDocModal() {
    const modal = await this.modalCtr.create({
      component: ModelosDocsComponent,
      componentProps: {
        model: 'check-list',
        docType: 'check-list',
        justButton: true,
        fullSize: true,
        model_id_value: 1,
        asModal: true
      },
      swipeToClose: true,
      cssClass: 'edit-form',
    });
    await  modal.present();
    const {data} = await modal.onWillDismiss();
    console.log('openModelosDocsModal data -->', data);
  }

}

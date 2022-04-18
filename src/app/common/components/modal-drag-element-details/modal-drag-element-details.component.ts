import {Component, Input, OnInit} from '@angular/core';
import {SweetMessagesService} from '../../../services/sweet-messages.service';
import {FilesService} from '../../../services/files.service';
import {ModalController} from '@ionic/angular';
import {DragObjProperties} from '../../draggable-resizable/draggable-resizable.component';
import {CheckListService} from '../../../services/check-list.service';

@Component({
  selector: 'app-modal-drag-element-details',
  templateUrl: './modal-drag-element-details.component.html',
  styleUrls: ['./modal-drag-element-details.component.scss'],
})
export class ModalDragElementDetailsComponent implements OnInit {

  @Input() dragObj: DragObjProperties;
  @Input() asModal: boolean;

  @Input() dragId: number;

  constructor(
    private sweetMsgServ: SweetMessagesService,
    public filesServ: FilesService,
    public modalCtrl: ModalController,
    public checkListServ: CheckListService
  ) { }

  ngOnInit() {
    this.getInfo();
  }

  getInfo() {
    this.checkListServ.showInfo(this.dragId).subscribe(res => {
      if (res.ok) {
        this.dragObj = res.data;
      }
    }, error => {
      console.log(error);
      this.sweetMsgServ.printStatusArray(error.error.errors, 'error');
      this.dismiss();
    })
  }

  dismiss(reload?) {
    this.modalCtrl.dismiss({
      reload
    });
  }

}

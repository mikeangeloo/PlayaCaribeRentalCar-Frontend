import {Component, Input, OnInit} from '@angular/core';
import {SweetMessagesService} from '../../../services/sweet-messages.service';
import {FilesService} from '../../../services/files.service';
import {ModalController} from '@ionic/angular';
import {DragObjProperties} from '../../draggable-resizable/draggable-resizable.component';
import {CheckListService} from '../../../services/check-list.service';
import {NotasService} from '../../../services/notas.service';
import {ToastMessageService} from '../../../services/toast-message.service';
import {SessionService} from '../../../services/session.service';
import {ProfileDataI} from '../../../interfaces/profile/profile-data.interface';

@Component({
  selector: 'app-modal-drag-element-details',
  templateUrl: './modal-drag-element-details.component.html',
  styleUrls: ['./modal-drag-element-details.component.scss'],
})
export class ModalDragElementDetailsComponent implements OnInit {

  dragObj: DragObjProperties;
  @Input() asModal: boolean;
  @Input() dragId: number;

  tempComment: any;
  userProfile: ProfileDataI;

  constructor(
    private sweetMsgServ: SweetMessagesService,
    public filesServ: FilesService,
    public modalCtrl: ModalController,
    public checkListServ: CheckListService,
    public notasServ: NotasService,
    public toastServ: ToastMessageService,
    public authServ: SessionService
  ) { }

  ngOnInit() {
    this.getInfo();
    this.userProfile = this.authServ.getProfile();
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

  saveComment(comment) {
    this.notasServ.saveUpdate(comment.nota, this.dragObj.id, 'check_in', comment.id).subscribe(res => {
      if (res.ok) {
        this.toastServ.presentToast('success', res.message, 'top');
      }
    }, error =>  {
      console.log(error);
      comment = this.tempComment;
      this.tempComment = null;
      this.sweetMsgServ.printStatusArray(error.error.errors, 'error');
    })
  }

  editComment(comment) {
    this.tempComment = JSON.parse(JSON.stringify(comment));
    comment.edit = true;
  }

  cancelComment(comment) {
    comment.nota = JSON.parse(JSON.stringify(this.tempComment.nota));
    comment.edit = false;
  }

  dismiss(reload?) {
    this.modalCtrl.dismiss({
      reload
    });
  }

}

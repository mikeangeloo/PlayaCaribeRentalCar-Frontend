import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ModalController} from "@ionic/angular";
import {GeneralService} from "../../../../services/general.service";
import {SweetMessagesService} from "../../../../services/sweet-messages.service";
import {ToastMessageService} from "../../../../services/toast-message.service";
import {AreaTrabajoI} from "../../../../interfaces/profile/area-trabajo.interface";
import {AreasTrabajoService} from "../../../../services/areas-trabajo.service";

@Component({
  selector: 'app-area-trabajo-form',
  templateUrl: './area-trabajo-form.component.html',
  styleUrls: ['./area-trabajo-form.component.scss'],
})
export class AreaTrabajoFormComponent implements OnInit {

  @Input() asModal: boolean;
  @Input() areaTrabajo_id: number;
  public title: string;
  public areaTrabajoForm: FormGroup;
  public areaTrabajoData: AreaTrabajoI;
  constructor(
    public modalCtrl: ModalController,
    private fb: FormBuilder,
    private areasTrabajoServ: AreasTrabajoService,
    private generalServ: GeneralService,
    private sweetMsg: SweetMessagesService,
    private toastServ: ToastMessageService
  ) {
    this.title = 'Formulario Aréas Trabajo';
    this.areaTrabajoForm = this.fb.group({
      id: [null],
      nombre: [null, Validators.required],
      activo: [null]
    });
  }

  get cf() {
    return this.areaTrabajoForm.controls;
  }

  ngOnInit() {
    if (this.areaTrabajo_id) {
      this.loadAreaTrabajoData();
    } else {
      this.initAreaTrabajoForm();
    }
  }

  initAreaTrabajoForm(data?) {
    this.areaTrabajoForm.setValue({
      id: (data && data.id) ? data.id : null,
      nombre: (data && data.nombre) ? data.nombre : null,
      activo: (data && data.activo) ? data.activo : 0,
    });
    this.cf.activo.disable();
  }



  loadAreaTrabajoData() {
    this.generalServ.presentLoading();
    this.areasTrabajoServ.getDataById(this.areaTrabajo_id).subscribe(res => {
      this.generalServ.dismissLoading();
      if (res.ok === true) {
        this.initAreaTrabajoForm(res.area_trabajo);
      }
    }, error => {
      this.generalServ.dismissLoading();
      console.log(error);
    });
  }

  saveUpdate() {
    if (this.areaTrabajoForm.invalid) {
      this.sweetMsg.printStatus('Debe llenar los campos requeridos', 'warning');
      this.areaTrabajoForm.markAllAsTouched();
      return;
    }
    this.generalServ.presentLoading('Guardando cambios ...');
    this.areasTrabajoServ.saveUpdate(this.areaTrabajoForm.value, this.areaTrabajo_id).subscribe(res => {
      this.generalServ.dismissLoading();
      this.dismiss(true);
      if (res.ok === true) {
        this.toastServ.presentToast('success', res.message, 'top');
      }
    }, error => {
      console.log(error);
      this.generalServ.dismissLoading();
    });
  }

  dismiss(reload?) {
    this.modalCtrl.dismiss({
      reload
    });
  }

}

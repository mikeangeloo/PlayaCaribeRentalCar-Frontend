import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AreaTrabajoI} from "../../../../interfaces/profile/area-trabajo.interface";
import {ModalController} from "@ionic/angular";
import {AreasTrabajoService} from "../../../../services/areas-trabajo.service";
import {GeneralService} from "../../../../services/general.service";
import {SweetMessagesService} from "../../../../services/sweet-messages.service";
import {ToastMessageService} from "../../../../services/toast-message.service";
import {RoleI} from "../../../../interfaces/profile/role.interface";
import {RolesService} from "../../../../services/roles.service";

@Component({
  selector: 'app-rol-form',
  templateUrl: './rol-form.component.html',
  styleUrls: ['./rol-form.component.scss'],
})
export class RolFormComponent implements OnInit {

  @Input() asModal: boolean;
  @Input() rol_id: number;
  public title: string;
  public rolForm: FormGroup;
  public rolData: RoleI;
  constructor(
    public modalCtrl: ModalController,
    private fb: FormBuilder,
    private rolServ: RolesService,
    private generalServ: GeneralService,
    private sweetMsg: SweetMessagesService,
    private toastServ: ToastMessageService
  ) {
    this.title = 'Formulario Rol';
    this.rolForm = this.fb.group({
      id: [null],
      rol: [null, Validators.required],
      activo: [null]
    });
  }

  get rf() {
    return this.rolForm.controls;
  }

  ngOnInit() {
    if (this.rol_id) {
      this.loadRolData();
    } else {
      this.initRolForm();
    }
  }

  initRolForm(data?) {
    this.rolForm.setValue({
      id: (data && data.id) ? data.id : null,
      rol: (data && data.rol) ? data.rol : null,
      activo: (data && data.activo) ? data.activo : 0,
    });
    this.rf.activo.disable();
  }



  loadRolData() {
    this.generalServ.presentLoading();
    this.rolServ.getDataById(this.rol_id).subscribe(res => {
      this.generalServ.dismissLoading();
      if (res.ok === true) {
        this.initRolForm(res.rol);
      }
    }, error => {
      this.generalServ.dismissLoading();
      console.log(error);
    });
  }

  saveUpdate() {
    if (this.rolForm.invalid) {
      this.sweetMsg.printStatus('Debe llenar los campos requeridos', 'warning');
      this.rolForm.markAllAsTouched();
      return;
    }
    this.generalServ.presentLoading('Guardando cambios ...');
    this.rolServ.saveUpdate(this.rolForm.value, this.rol_id).subscribe(res => {
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

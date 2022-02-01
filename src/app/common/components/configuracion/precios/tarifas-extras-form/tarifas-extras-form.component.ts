import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ClasesVehiculosI} from '../../../../../interfaces/catalogo-vehiculos/clases-vehiculos.interface';
import {ModalController} from '@ionic/angular';
import {ClasesVehiculosService} from '../../../../../services/clases-vehiculos.service';
import {GeneralService} from '../../../../../services/general.service';
import {SweetMessagesService} from '../../../../../services/sweet-messages.service';
import {ToastMessageService} from '../../../../../services/toast-message.service';
import {TarifasExtrasService} from '../../../../../services/tarifas-extras.service';

@Component({
  selector: 'app-tarifas-extras-form',
  templateUrl: './tarifas-extras-form.component.html',
  styleUrls: ['./tarifas-extras-form.component.scss'],
})
export class TarifasExtrasFormComponent implements OnInit {

  @Input() asModal: boolean;
  @Input() tarifa_extra_id: number;
  public title: string;
  public tarifaExtraForm: FormGroup;
  constructor(
      public modalCtrl: ModalController,
      private fb: FormBuilder,
      private tarifaExtraServ: TarifasExtrasService,
      private generalServ: GeneralService,
      private sweetMsg: SweetMessagesService,
      private toastServ: ToastMessageService
  ) {
    this.title = 'Formulario Tarifas Extras';
    this.tarifaExtraForm = this.fb.group({
      id: [null],
      nombre: [null, Validators.required],
      precio: [null, Validators.required],
      activo: [null]
    });
  }

  get tf() {
    return this.tarifaExtraForm.controls;
  }

  ngOnInit() {
    if (this.tarifa_extra_id) {
      this.loadTarifasExtrasData();
    } else {
      this.initTarifasExtrasForm();
    }
  }

  initTarifasExtrasForm(data?) {
    this.tarifaExtraForm.setValue({
      id: (data && data.id) ? data.id : null,
      nombre: (data && data.nombre) ? data.nombre : null,
      precio: (data && data.precio) ? data.precio : null,
      activo: (data && data.activo) ? data.activo : 0,
    });
    this.tf.activo.disable();
  }



  loadTarifasExtrasData() {
    this.generalServ.presentLoading();
    this.tarifaExtraServ.getDataById(this.tarifa_extra_id).subscribe(res => {
      this.generalServ.dismissLoading();
      if (res.ok === true) {
        this.initTarifasExtrasForm(res.data);
      }
    }, error => {
      this.generalServ.dismissLoading();
      console.log(error);
    });
  }

  saveUpdate() {
    if (this.tarifaExtraForm.invalid) {
      this.sweetMsg.printStatus('Debe llenar los campos requeridos', 'warning');
      this.tarifaExtraForm.markAllAsTouched();
      return;
    }
    this.generalServ.presentLoading('Guardando cambios ...');
    this.tarifaExtraServ.saveUpdate(this.tarifaExtraForm.value, this.tarifa_extra_id).subscribe(res => {
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

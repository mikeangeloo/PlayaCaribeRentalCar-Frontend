import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ModalController} from '@ionic/angular';
import {GeneralService} from '../../../../services/general.service';
import {SweetMessagesService} from '../../../../services/sweet-messages.service';
import {ToastMessageService} from '../../../../services/toast-message.service';
import {ClasesVehiculosI} from '../../../../interfaces/catalogo-vehiculos/clases-vehiculos.interface';
import {ClasesVehiculosService} from '../../../../services/clases-vehiculos.service';

@Component({
  selector: 'app-clase-vehiculo-form',
  templateUrl: './clase-vehiculo-form.component.html',
  styleUrls: ['./clase-vehiculo-form.component.scss'],
})
export class ClaseVehiculoFormComponent implements OnInit {

  @Input() asModal: boolean;
  @Input() clase_vehiculo_id: number;
  public title: string;
  public claseVehiculoForm: FormGroup;
  constructor(
      public modalCtrl: ModalController,
      private fb: FormBuilder,
      private classVehiculosServ: ClasesVehiculosService,
      private generalServ: GeneralService,
      private sweetMsg: SweetMessagesService,
      private toastServ: ToastMessageService
  ) {
    this.title = 'Formulario Clases Vehículos';
    this.claseVehiculoForm = this.fb.group({
      id: [null],
      clase: [null, Validators.required],
      activo: [null]
    });
  }

  get cf() {
    return this.claseVehiculoForm.controls;
  }

  ngOnInit() {
    if (this.clase_vehiculo_id) {
      this.loadClasesVehiculosData();
    } else {
      this.initClasesVehiculoForm();
    }
  }

  initClasesVehiculoForm(data?) {
    this.claseVehiculoForm.setValue({
      id: (data && data.id) ? data.id : null,
      clase: (data && data.clase) ? data.clase : null,
      activo: (data && data.activo) ? data.activo : 0,
    });
    this.cf.activo.disable();
  }



  loadClasesVehiculosData() {
    this.generalServ.presentLoading();
    this.classVehiculosServ.getDataById(this.clase_vehiculo_id).subscribe(res => {
      this.generalServ.dismissLoading();
      if (res.ok === true) {
        this.initClasesVehiculoForm(res.data);
      }
    }, error => {
      this.generalServ.dismissLoading();
      console.log(error);
    });
  }

  saveUpdate() {
    if (this.claseVehiculoForm.invalid) {
      this.sweetMsg.printStatus('Debe llenar los campos requeridos', 'warning');
      this.claseVehiculoForm.markAllAsTouched();
      return;
    }
    this.generalServ.presentLoading('Guardando cambios ...');
    this.classVehiculosServ.saveUpdate(this.claseVehiculoForm.value, this.clase_vehiculo_id).subscribe(res => {
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

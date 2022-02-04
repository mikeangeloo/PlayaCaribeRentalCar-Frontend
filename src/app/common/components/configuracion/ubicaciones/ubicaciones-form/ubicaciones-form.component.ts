import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ModalController} from '@ionic/angular';
import {GeneralService} from '../../../../../services/general.service';
import {SweetMessagesService} from '../../../../../services/sweet-messages.service';
import {ToastMessageService} from '../../../../../services/toast-message.service';
import {UbicacionesService} from '../../../../../services/ubicaciones.service';

@Component({
  selector: 'app-ubicaciones-form',
  templateUrl: './ubicaciones-form.component.html',
  styleUrls: ['./ubicaciones-form.component.scss'],
})
export class UbicacionesFormComponent implements OnInit {

  @Input() asModal: boolean;
  @Input() ubicacion_id: number;
  public title: string;
  public ubicacionForm: FormGroup;
  constructor(
      public modalCtrl: ModalController,
      private fb: FormBuilder,
      private ubicacionesServ: UbicacionesService,
      private generalServ: GeneralService,
      private sweetMsg: SweetMessagesService,
      private toastServ: ToastMessageService
  ) {
    this.title = 'Formulario Ubicación';
    this.ubicacionForm = this.fb.group({
      id: [null],
      pais: [null, Validators.required],
      estado: [null, Validators.required],
      municipio: [null, Validators.required],
      colonia: [null, Validators.required],
      direccion: [null, Validators.required],
      cp: [null, Validators.required],
      referencias: [null],
      activo: [null],
      alias: [null, Validators.required]
    });
  }

  get uf() {
    return this.ubicacionForm.controls;
  }

  ngOnInit() {
    if (this.ubicacion_id) {
      this.loadUbicacionData();
    } else {
      this.initUbicacionForm();
    }
  }

  initUbicacionForm(data?) {
    this.ubicacionForm.setValue({
      id: (data && data.id) ? data.id : null,
      pais: (data && data.pais) ? data.pais : 'México',
      estado: (data && data.estado) ? data.estado : 'Quintana Roo',
      municipio: (data && data.municipio) ? data.municipio : null,
      colonia: (data && data.colonia) ? data.colonia : null,
      direccion: (data && data.direccion) ? data.direccion : null,
      cp: (data && data.cp) ? data.cp : null,
      referencias: (data && data.referencias) ? data.referencias : null,
      activo: (data && data.activo) ? data.activo : 0,
      alias: (data && data.alias) ? data.alias: null
    });
    this.uf.activo.disable();
  }



  loadUbicacionData() {
    this.generalServ.presentLoading();
    this.ubicacionesServ.getDataById(this.ubicacion_id).subscribe(res => {
      this.generalServ.dismissLoading();
      if (res.ok === true) {
        this.initUbicacionForm(res.data);
      }
    }, error => {
      this.generalServ.dismissLoading();
      console.log(error);
    });
  }

  saveUpdate() {
    if (this.ubicacionForm.invalid) {
      this.sweetMsg.printStatus('Debe llenar los campos requeridos', 'warning');
      this.ubicacionForm.markAllAsTouched();
      return;
    }
    this.generalServ.presentLoading('Guardando cambios ...');
    this.ubicacionesServ.saveUpdate(this.ubicacionForm.value, this.ubicacion_id).subscribe(res => {
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

import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ModalController} from '@ionic/angular';
import {GeneralService} from '../../../../services/general.service';
import {SweetMessagesService} from '../../../../services/sweet-messages.service';
import {ToastMessageService} from '../../../../services/toast-message.service';
import {PolizasService} from '../../../../services/polizas.service';

@Component({
  selector: 'app-poliza-form',
  templateUrl: './poliza-form.component.html',
  styleUrls: ['./poliza-form.component.scss'],
})
export class PolizaFormComponent implements OnInit {

  @Input() asModal: boolean;
  @Input() poliza_id: number;
  public title: string;
  public polizaForm: FormGroup;
  constructor(
    public modalCtrl: ModalController,
    private fb: FormBuilder,
    private polizaServ: PolizasService,
    private generalServ: GeneralService,
    private sweetMsg: SweetMessagesService,
    private toastServ: ToastMessageService
  ) {
    this.title = 'Formulario Pólizas';
    this.polizaForm = this.fb.group({
      id: [null],
      aseguradora: [null, Validators.required],
      no_poliza: [null, Validators.required],
      tipo_poliza: [null, Validators.required],
      tel_contacto: [null, Validators.required],
      titular: [null, Validators.required],
      fecha_inicio: [null, Validators.required],
      fecha_fin: [null, Validators.required],
      activo: [null]
    });
  }

  get pf() {
    return this.polizaForm.controls;
  }

  ngOnInit() {
    if (this.poliza_id) {
      this.loadPolizasExtrasData();
    } else {
      this.initPolizasExtrasForm();
    }
  }

  initPolizasExtrasForm(data?) {
    this.polizaForm.setValue({
      id: (data && data.id) ? data.id : null,
      aseguradora: (data && data.aseguradora) ? data.aseguradora : null,
      no_poliza: (data && data.no_poliza) ? data.no_poliza : null,
      tipo_poliza: (data && data.tipo_poliza) ? data.tipo_poliza : null,
      tel_contacto: (data && data.tel_contacto) ? data.tel_contacto : null,
      titular: (data && data.titular) ? data.titular : null,
      fecha_inicio: (data && data.fecha_inicio) ? data.fecha_inicio : null,
      fecha_fin: (data && data.fecha_fin) ? data.fecha_fin : null,
      activo: (data && data.activo) ? data.activo : 1,
    });
    this.pf.activo.disable();
  }



  loadPolizasExtrasData() {
    this.generalServ.presentLoading();
    this.polizaServ.getDataById(this.poliza_id).subscribe(res => {
      this.generalServ.dismissLoading();
      if (res.ok === true) {
        this.initPolizasExtrasForm(res.data);
      }
    }, error => {
      this.generalServ.dismissLoading();
      console.log(error);
    });
  }

  saveUpdate() {
    if (this.polizaForm.invalid) {
      this.sweetMsg.printStatus('Debe llenar los campos requeridos', 'warning');
      this.polizaForm.markAllAsTouched();
      return;
    }
    this.generalServ.presentLoading('Guardando cambios ...');
    this.polizaServ.saveUpdate(this.polizaForm.value, this.poliza_id).subscribe(res => {
      this.generalServ.dismissLoading();
      this.dismiss(true);
      if (res.ok === true) {
        this.toastServ.presentToast('success', res.message, 'top');
      }
    }, error => {
      console.log(error);
      this.generalServ.dismissLoading();
      this.sweetMsg.printStatusArray(error.error.errors, 'error')
    });
  }

  dismiss(reload?) {
    this.modalCtrl.dismiss({
      reload
    });
  }

}

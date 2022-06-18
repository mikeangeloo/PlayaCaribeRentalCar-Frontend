import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ModalController} from '@ionic/angular';
import {GeneralService} from '../../../../../services/general.service';
import {SweetMessagesService} from '../../../../../services/sweet-messages.service';
import {ToastMessageService} from '../../../../../services/toast-message.service';
import { CargosRetornoExtrasService } from 'src/app/services/cargos-retorno-extras.service';

@Component({
  selector: 'app-cargos-extras-form',
  templateUrl: './cargos-extras-form.component.html',
  styleUrls: ['./cargos-extras-form.component.scss'],
})
export class CargosExtrasFormComponent implements OnInit {
  @Input() asModal: boolean;
  @Input() cargo_extra_id: number;
  public title: string;
  public cargoExtraForm: FormGroup;
  constructor(
    public modalCtrl: ModalController,
    private fb: FormBuilder,
    private cargosRetornoExtrasServ: CargosRetornoExtrasService,
    private generalServ: GeneralService,
    private sweetMsg: SweetMessagesService,
    private toastServ: ToastMessageService
  ) {
    this.title = 'Formulario Cargos Extras';
    this.cargoExtraForm = this.fb.group({
      id: [null],
      nombre: [null, Validators.required],
      tipo: [null, Validators.required],
      precio: [null, Validators.required],
      activo: [null]
    });
  }

  get tf() {
    return this.cargoExtraForm.controls;
  }

  ngOnInit() {
    if (this.cargo_extra_id) {
      this.loadCargosExtrasData();
    } else {
      this.initCargosExtrasForm();
    }
  }

  initCargosExtrasForm(data?) {
    this.cargoExtraForm.setValue({
      id: (data && data.id) ? data.id : null,
      nombre: (data && data.nombre) ? data.nombre : null,
      tipo: (data && data.tipo) ? data.tipo : null,
      precio: (data && data.precio) ? data.precio : null,
      activo: (data && data.activo) ? data.activo : 0,
    });
    this.tf.activo.disable();
  }



  loadCargosExtrasData() {
    this.generalServ.presentLoading();
    this.cargosRetornoExtrasServ.getDataById(this.cargo_extra_id).subscribe(res => {
      this.generalServ.dismissLoading();
      if (res.ok === true) {
        this.initCargosExtrasForm(res.data);
      }
    }, error => {
      this.generalServ.dismissLoading();
      console.log(error);
    });
  }

  saveUpdate() {
    if (this.cargoExtraForm.invalid) {
      this.sweetMsg.printStatus('Debe llenar los campos requeridos', 'warning');
      this.cargoExtraForm.markAllAsTouched();
      return;
    }
    this.generalServ.presentLoading('Guardando cambios ...');
    this.cargosRetornoExtrasServ.saveUpdate(this.cargoExtraForm.value, this.cargo_extra_id).subscribe(res => {
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

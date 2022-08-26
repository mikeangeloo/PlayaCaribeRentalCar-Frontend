import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ModalController} from '@ionic/angular';
import { VehiculosI } from 'src/app/interfaces/catalogo-vehiculos/vehiculos.interface';
import { GeneralService } from 'src/app/services/general.service';
import { VehiculosService } from 'src/app/services/vehiculos.service';
import {SweetMessagesService} from '../../../../services/sweet-messages.service';
import {ToastMessageService} from '../../../../services/toast-message.service';

@Component({
  selector: 'app-vehiculos-estatus-form',
  templateUrl: './vehiculos-estatus-form.component.html',
  styleUrls: ['./vehiculos-estatus-form.component.scss'],
})
export class VehiculosEstatusFormComponent implements OnInit {

  @Input() asModal: boolean;
  @Input() vehiculo_id: number;
  public title: string;
  public vehiculoEstatusForm: FormGroup;
  public vehiculoData: VehiculosI;

  constructor(
    public fb:  FormBuilder,
    public modalCtrl: ModalController,
    private generalServ: GeneralService,
    private sweetMsg: SweetMessagesService,
    private toastServ: ToastMessageService,
    private vehiculosServ: VehiculosService,
  ) {
    this.title = 'Cambio de estatus del vehículo';
   }

    //#region CLIENT FORM FUNCTIONS
    initEstatusForm(data?) {
      this.vehiculoEstatusForm = this.fb.group({
        estatus: [(data && data.estatus ? data.estatus : null), Validators.required],
        observaciones: [(data && data.observaciones ? data.observaciones: null), Validators.required],
      });
    }

    get vef() {
      return this.vehiculoEstatusForm.controls;
    }

    //#endregion

  ngOnInit() {
    this.initEstatusForm()
  }

  saveEstatus() {
    if (this.vehiculoEstatusForm.invalid ) {
      this.sweetMsg.printStatus('Debe llenar los campos requeridos', 'warning');
      this.vehiculoEstatusForm.markAllAsTouched();
      return;
    }

    this.generalServ.presentLoading('Guardando cambios ...');
    let data = {
      estatus: this.vehiculoEstatusForm.value.estatus,
      observaciones: this.vehiculoEstatusForm.value.observaciones,
    }
    this.vehiculosServ.updateStatus(data, this.vehiculo_id).subscribe(res => {
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

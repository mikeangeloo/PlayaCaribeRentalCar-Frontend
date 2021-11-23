import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {EmpresasI} from "../../../../interfaces/empresas.interface";
import {ModalController} from "@ionic/angular";
import {EmpresasService} from "../../../../services/empresas.service";
import {GeneralService} from "../../../../services/general.service";
import {SweetMessagesService} from "../../../../services/sweet-messages.service";
import {ToastMessageService} from "../../../../services/toast-message.service";
import {SucursalesI} from "../../../../interfaces/sucursales.interface";
import {SucursalesService} from "../../../../services/sucursales.service";

@Component({
  selector: 'app-sucursal-form',
  templateUrl: './sucursal-form.component.html',
  styleUrls: ['./sucursal-form.component.scss'],
})
export class SucursalFormComponent implements OnInit {

  @Input() asModal: boolean;
  @Input() sucursal_id: number;
  public title: string;
  public sucursalForm: FormGroup;
  public sucursalData: SucursalesI;
  constructor(
    public modalCtrl: ModalController,
    private fb: FormBuilder,
    private sucursalesServ: SucursalesService,
    private generalServ: GeneralService,
    private sweetMsg: SweetMessagesService,
    private toastServ: ToastMessageService
  ) {
    this.title = 'Formulario Sucursal';
    this.sucursalForm = this.fb.group({
      id: [null],
      nombre: [null, Validators.required],
      direccion: [null, Validators.required],
      codigo: [null, Validators.required],
      cp: [null, Validators.required],
      activo: [null]
    });
  }

  get sf() {
    return this.sucursalForm.controls;
  }

  ngOnInit() {
    if (this.sucursal_id) {
      this.loadSucursalData();
    } else {
      this.initSucursalForm();
    }
  }

  initSucursalForm(data?) {
    this.sucursalForm.setValue({
      id: (data && data.id) ? data.id : null,
      nombre: (data && data.nombre) ? data.nombre : null,
      direccion: (data && data.direccion) ? data.direccion : null,
      codigo: (data && data.codigo) ? data.codigo : null,
      cp: (data && data.cp) ? data.cp : null,
      activo: (data && data.activo) ? data.activo : 0,
    });
    this.sf.activo.disable();
  }



  loadSucursalData() {
    this.generalServ.presentLoading();
    this.sucursalesServ.getDataById(this.sucursal_id).subscribe(res => {
      this.generalServ.dismissLoading();
      if (res.ok === true) {
        this.initSucursalForm(res.sucursal);
      }
    }, error => {
      this.generalServ.dismissLoading();
      console.log(error);
    });
  }

  saveUpdate() {
    if (this.sucursalForm.invalid) {
      this.sweetMsg.printStatus('Debe llenar los campos requeridos', 'warning');
      this.sucursalForm.markAllAsTouched();
      return;
    }
    this.generalServ.presentLoading('Guardando cambios ...');
    this.sucursalesServ.saveUpdate(this.sucursalForm.value, this.sucursal_id).subscribe(res => {
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

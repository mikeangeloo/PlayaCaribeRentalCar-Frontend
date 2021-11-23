import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SucursalesI} from "../../../../interfaces/sucursales.interface";
import {ModalController} from "@ionic/angular";
import {SucursalesService} from "../../../../services/sucursales.service";
import {GeneralService} from "../../../../services/general.service";
import {SweetMessagesService} from "../../../../services/sweet-messages.service";
import {ToastMessageService} from "../../../../services/toast-message.service";
import {MarcasI} from "../../../../interfaces/marcas.interface";
import {MarcasService} from "../../../../services/marcas.service";

@Component({
  selector: 'app-marcas-form',
  templateUrl: './marcas-form.component.html',
  styleUrls: ['./marcas-form.component.scss'],
})
export class MarcasFormComponent implements OnInit {

  @Input() asModal: boolean;
  @Input() marca_id: number;
  public title: string;
  public marcaForm: FormGroup;
  public marcaData: MarcasI;
  constructor(
    public modalCtrl: ModalController,
    private fb: FormBuilder,
    private marcasServ: MarcasService,
    private generalServ: GeneralService,
    private sweetMsg: SweetMessagesService,
    private toastServ: ToastMessageService
  ) {
    this.title = 'Formulario Marca Vehículos';
    this.marcaForm = this.fb.group({
      id: [null],
      marca: [null, Validators.required],
      tipo: [null, Validators.required],
      activo: [null]
    });
  }

  get mf() {
    return this.marcaForm.controls;
  }

  ngOnInit() {
    if (this.marca_id) {
      this.loadMarcaData();
    } else {
      this.initMarcaForm();
    }
  }

  initMarcaForm(data?) {
    this.marcaForm.setValue({
      id: (data && data.id) ? data.id : null,
      marca: (data && data.marca) ? data.marca : null,
      tipo: (data && data.tipo) ? data.tipo : 0,
      activo: (data && data.activo) ? data.activo : 0,
    });
    this.mf.activo.disable();
  }



  loadMarcaData() {
    this.generalServ.presentLoading();
    this.marcasServ.getDataById(this.marca_id).subscribe(res => {
      this.generalServ.dismissLoading();
      if (res.ok === true) {
        this.initMarcaForm(res.marca);
      }
    }, error => {
      this.generalServ.dismissLoading();
      console.log(error);
    });
  }

  saveUpdate() {
    if (this.marcaForm.invalid) {
      this.sweetMsg.printStatus('Debe llenar los campos requeridos', 'warning');
      this.marcaForm.markAllAsTouched();
      return;
    }
    this.generalServ.presentLoading('Guardando cambios ...');
    this.marcasServ.saveUpdate(this.marcaForm.value, this.marca_id).subscribe(res => {
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

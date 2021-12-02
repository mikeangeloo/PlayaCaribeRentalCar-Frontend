import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MarcasI} from "../../../../interfaces/marcas.interface";
import {ModalController} from "@ionic/angular";
import {MarcasService} from "../../../../services/marcas.service";
import {GeneralService} from "../../../../services/general.service";
import {SweetMessagesService} from "../../../../services/sweet-messages.service";
import {ToastMessageService} from "../../../../services/toast-message.service";
import {ModelosI} from "../../../../interfaces/modelos.interface";
import {ModelosService} from "../../../../services/modelos.service";

@Component({
  selector: 'app-modelos-form',
  templateUrl: './modelos-form.component.html',
  styleUrls: ['./modelos-form.component.scss'],
})
export class ModelosFormComponent implements OnInit {

  @Input() asModal: boolean;
  @Input() modelo_id: number;
  public marcas: MarcasI[];
  public title: string;
  public modeloForm: FormGroup;
  public modeloData: ModelosI;
  constructor(
    public modalCtrl: ModalController,
    private fb: FormBuilder,
    private modelosServ: ModelosService,
    private marcaServ: MarcasService,
    private generalServ: GeneralService,
    private sweetMsg: SweetMessagesService,
    private toastServ: ToastMessageService
  ) {
    this.title = 'Formulario Modelo Vehículos';
    this.modeloForm = this.fb.group({
      id: [null],
      modelo: [null, Validators.required],
      marca_id: [null, Validators.required],
      activo: [null]
    });
  }

  get mf() {
    return this.modeloForm.controls;
  }

  ngOnInit() {
    this.loadMarcas();
    if (this.modelo_id) {
      this.loadModeloData();
    } else {
      this.initModeloForm();
    }
  }

  loadMarcas() {
    this.marcaServ.getActive().subscribe(res => {
      if (res.ok === true) {
        this.marcas = res.marcas;
      }
    }, error =>  {
      console.log(error);
    })
  }

  initModeloForm(data?) {
    this.modeloForm.setValue({
      id: (data && data.id) ? data.id : null,
      modelo: (data && data.modelo) ? data.modelo : null,
      marca_id: (data && data.marca_id) ? data.marca_id : null,
      activo: (data && data.activo) ? data.activo : 0,
    });
    this.mf.activo.disable();
  }



  loadModeloData() {
    this.generalServ.presentLoading();
    this.modelosServ.getDataById(this.modelo_id).subscribe(res => {
      this.generalServ.dismissLoading();
      if (res.ok === true) {
        this.initModeloForm(res.modelo);
      }
    }, error => {
      this.generalServ.dismissLoading();
      console.log(error);
    });
  }

  saveUpdate() {
    if (this.modeloForm.invalid) {
      this.sweetMsg.printStatus('Debe llenar los campos requeridos', 'warning');
      this.modeloForm.markAllAsTouched();
      return;
    }
    this.generalServ.presentLoading('Guardando cambios ...');
    this.modelosServ.saveUpdate(this.modeloForm.value, this.modelo_id).subscribe(res => {
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

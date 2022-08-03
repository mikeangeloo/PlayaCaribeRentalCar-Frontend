import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MarcasVehiculosI} from "../../../../interfaces/catalogo-vehiculos/marcas-vehiculos.interface";
import {ModalController} from "@ionic/angular";
import {MarcasVehiculosService} from "../../../../services/marcas-vehiculos.service";
import {GeneralService} from "../../../../services/general.service";
import {SweetMessagesService} from "../../../../services/sweet-messages.service";
import {ToastMessageService} from "../../../../services/toast-message.service";
import {CategoriasVehiculosI} from "../../../../interfaces/catalogo-vehiculos/categorias-vehiculos.interface";
import {CategoriaVehiculosService} from "../../../../services/categoria-vehiculos.service";
import { LayoutModalComponent } from '../layout-modal/layout-modal.component';
import { DocDataTransfer } from 'src/app/interfaces/shared/doc-data-tranfer.interface';
import { AddLayaoutModalComponent } from '../add-layaout-modal/add-layaout-modal.component';

@Component({
  selector: 'app-categoria-vehiculos-form',
  templateUrl: './categoria-vehiculos-form.component.html',
  styleUrls: ['./categoria-vehiculos-form.component.scss'],
})
export class CategoriaVehiculosFormComponent implements OnInit {

  @Input() asModal: boolean;
  @Input() categoria_vehiculo_id: number;
  @Input() last_id: number;
  public title: string;
  public categoriaVehiculoForm: FormGroup;
  public categoriaVehiculoData: CategoriasVehiculosI;
  public layoutSeleccionado: DocDataTransfer = null;
  public layout: DocDataTransfer = null;
  constructor(
    public modalCtrl: ModalController,
    private fb: FormBuilder,
    private catVehiculosServ: CategoriaVehiculosService,
    private marcaServ: MarcasVehiculosService,
    private generalServ: GeneralService,
    private sweetMsg: SweetMessagesService,
    private toastServ: ToastMessageService
  ) {
    this.title = 'Formulario Categorías Vehículos';
    this.categoriaVehiculoForm = this.fb.group({
      id: [null],
      categoria: [null, Validators.required],
      activo: [null]
    });
  }

  get mf() {
    return this.categoriaVehiculoForm.controls;
  }

  ngOnInit() {
    console.log('categoria_vehiculo_id', this.categoria_vehiculo_id);
    if (this.categoria_vehiculo_id) {
      this.loadCategoriasVehiculosData();
    } else {
      this.initCategoriaVehiculoForm();
    }
  }


  initCategoriaVehiculoForm(data?) {
    this.categoriaVehiculoForm.setValue({
      id: (data && data.id) ? data.id : null,
      categoria: (data && data.categoria) ? data.categoria : null,
      activo: (data && data.activo) ? data.activo : 0,
    });
    this.mf.activo.disable();
  }



  loadCategoriasVehiculosData() {
    this.generalServ.presentLoading();
    this.catVehiculosServ.getDataById(this.categoria_vehiculo_id).subscribe(res => {
      this.generalServ.dismissLoading();
      if (res.ok === true) {
        this.initCategoriaVehiculoForm(res.categoria);

        this.layout = res.layout;
      }
    }, error => {
      this.generalServ.dismissLoading();
      console.log(error);
    });
  }

  saveUpdate() {
    if (this.categoriaVehiculoForm.invalid ) {
      this.sweetMsg.printStatus('Debe llenar los campos requeridos', 'warning');
      this.categoriaVehiculoForm.markAllAsTouched();
      return;
    }
    if (this.layoutSeleccionado == null ) {
      this.sweetMsg.printStatus('Debe seleccionar o subir imagen para la nueva categoría', 'warning');
      return;
    }
    this.generalServ.presentLoading('Guardando cambios ...');
    let data = {
      categoria: this.categoriaVehiculoForm.value,
      layout: this.layoutSeleccionado

    }
    this.catVehiculosServ.saveUpdate(data, this.categoria_vehiculo_id).subscribe(res => {
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

  async openLayoutSelectorModal() {
    const modal = await this.modalCtrl.create({
      component: LayoutModalComponent,
      componentProps: {
        'asModal': true,
      },
      swipeToClose: true,
      backdropDismiss: false,
      cssClass: 'medium-form'
    });
    await modal.present();
    const {data} = await modal.onDidDismiss();
    if (data.layout) {
      console.log(data.layout.url);

      this.setLayoutSelected(data);
    }
  }

  setLayoutSelected(data) {
    this.layout = null;
    this.layoutSeleccionado = data.layout
  }

  dismiss(reload?) {
    this.modalCtrl.dismiss({
      reload
    });
  }

}

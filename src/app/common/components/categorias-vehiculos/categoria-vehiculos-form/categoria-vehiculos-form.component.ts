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

@Component({
  selector: 'app-categoria-vehiculos-form',
  templateUrl: './categoria-vehiculos-form.component.html',
  styleUrls: ['./categoria-vehiculos-form.component.scss'],
})
export class CategoriaVehiculosFormComponent implements OnInit {

  @Input() asModal: boolean;
  @Input() categoria_vehiculo_id: number;
  public title: string;
  public categoriaVehiculoForm: FormGroup;
  public categoriaVehiculoData: CategoriasVehiculosI;
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
      }
    }, error => {
      this.generalServ.dismissLoading();
      console.log(error);
    });
  }

  saveUpdate() {
    if (this.categoriaVehiculoForm.invalid) {
      this.sweetMsg.printStatus('Debe llenar los campos requeridos', 'warning');
      this.categoriaVehiculoForm.markAllAsTouched();
      return;
    }
    this.generalServ.presentLoading('Guardando cambios ...');
    this.catVehiculosServ.saveUpdate(this.categoriaVehiculoForm.value, this.categoria_vehiculo_id).subscribe(res => {
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

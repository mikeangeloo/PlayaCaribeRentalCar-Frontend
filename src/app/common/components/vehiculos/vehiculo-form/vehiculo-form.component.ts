import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UsersI} from "../../../../interfaces/users.interface";
import {RoleI} from "../../../../interfaces/profile/role.interface";
import {AreaTrabajoI} from "../../../../interfaces/profile/area-trabajo.interface";
import {SucursalesI} from "../../../../interfaces/sucursales.interface";
import {ModalController} from "@ionic/angular";
import {UsersService} from "../../../../services/users.service";
import {GeneralService} from "../../../../services/general.service";
import {SweetMessagesService} from "../../../../services/sweet-messages.service";
import {ToastMessageService} from "../../../../services/toast-message.service";
import {RolesService} from "../../../../services/roles.service";
import {AreasTrabajoService} from "../../../../services/areas-trabajo.service";
import {SucursalesService} from "../../../../services/sucursales.service";
import {VehiculosI} from "../../../../interfaces/vehiculos.interface";
import {MarcasI} from "../../../../interfaces/marcas.interface";
import {ModelosI} from "../../../../interfaces/modelos.interface";
import {ColoresI} from "../../../../interfaces/colores.interface";
import {VehiculosService} from "../../../../services/vehiculos.service";
import {MarcasService} from "../../../../services/marcas.service";
import {ModelosService} from "../../../../services/modelos.service";
import {ColoresService} from "../../../../services/colores.service";

@Component({
  selector: 'app-vehiculo-form',
  templateUrl: './vehiculo-form.component.html',
  styleUrls: ['./vehiculo-form.component.scss'],
})
export class VehiculoFormComponent implements OnInit {

  @Input() asModal: boolean;
  @Input() vehiculo_id: number;
  public title: string;
  public vehiculoForm: FormGroup;
  public vehiculoData: VehiculosI;

  public marcasV: MarcasI[];
  public modeloV: ModelosI[];
  public coloresV: ColoresI[];

  constructor(
    public modalCtrl: ModalController,
    private fb: FormBuilder,
    private vehiculosServ: VehiculosService,
    private generalServ: GeneralService,
    private sweetMsg: SweetMessagesService,
    private toastServ: ToastMessageService,
    private modeloServ: ModelosService,
    private marcasServ: MarcasService,
    private coloresServ: ColoresService
  ) {
    this.title = 'Formulario Véhiculo';
    this.vehiculoForm = this.fb.group({
      id: [null],
      marca_id: [null, Validators.required],
      modelo_id: [null, Validators.required],
      color_id: [null, Validators.required],
      no_placas: [null, Validators.required],
      cap_tanque: [null, Validators.required],
      activo: [null],
      nombre: [null, Validators.required],
      version: [null, Validators.required],
      precio_venta: [null, Validators.required]
    });
  }

  get vf() {
    return this.vehiculoForm.controls;
  }

  ngOnInit() {
    this.loadMarcasV();
    this.loadModelosV();
    this.loadColoresV();

    if (this.vehiculo_id) {
      this.loadVehiculosData();
    } else {
      this.vehiculoData = null;
      this.initVehiculoForm();
    }
  }

  loadMarcasV() {
    this.marcasServ.getActive().subscribe(res => {
      if (res.ok === true) {
        this.marcasV = res.marcas;
      }
    }, error => {
      console.log(error);
    })
  }

  loadModelosV() {
    this.modeloServ.getActive().subscribe(res => {
      if (res.ok === true) {
        this.modeloV = res.modelos;
      }
    }, error =>  {
      console.log(error);
    })
  }

  loadColoresV() {
    this.coloresServ.getActive().subscribe(res => {
      if (res.ok === true) {
        this.coloresV = res.colores;
      }
    }, error => {
      console.log(error);
    })
  }

  initVehiculoForm(data?) {
    console.log(data);
    this.vehiculoForm.setValue({
      id: (data && data.id) ? data.id : null,
      marca_id: (data && data.marca_id) ? data.marca_id : null,
      modelo_id: (data && data.modelo_id) ? data.modelo_id : null,
      color_id: (data && data.color_id) ? data.color_id : null,
      no_placas: (data && data.no_placas) ? data.no_placas : null,
      cap_tanque: (data && data.cap_tanque) ? data.cap_tanque: null,
      activo: (data && data.activo) ? data.activo : 0,
      nombre: (data && data.nombre) ? data.nombre : null,
      version: (data && data.version) ? data.version : null,
      precio_venta: (data && data.precio_venta) ? data.precio_venta : null
    });
    this.vf.activo.disable();
  }



  loadVehiculosData() {
    this.generalServ.presentLoading();
    this.vehiculosServ.getDataById(this.vehiculo_id).subscribe(res => {
      this.generalServ.dismissLoading();
      if (res.ok === true) {
        this.vehiculoData = res.vehiculo;
        this.initVehiculoForm(res.vehiculo);
      }
    }, error => {
      this.generalServ.dismissLoading();
      console.log(error);
    });
  }

  saveUpdate() {
    if (this.vehiculoForm.invalid) {
      this.sweetMsg.printStatus('Debe llenar los campos requeridos', 'warning');
      this.vehiculoForm.markAllAsTouched();
      return;
    }
    this.generalServ.presentLoading('Guardando cambios ...');
    this.vehiculosServ.saveUpdate(this.vehiculoForm.value, this.vehiculo_id).subscribe(res => {
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

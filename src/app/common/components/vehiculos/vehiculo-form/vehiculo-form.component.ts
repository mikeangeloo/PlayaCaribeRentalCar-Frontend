import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ModalController} from "@ionic/angular";
import {GeneralService} from "../../../../services/general.service";
import {SweetMessagesService} from "../../../../services/sweet-messages.service";
import {ToastMessageService} from "../../../../services/toast-message.service";
import {VehiculosC, VehiculosI} from "../../../../interfaces/catalogo-vehiculos/vehiculos.interface";
import {MarcasVehiculosI} from "../../../../interfaces/catalogo-vehiculos/marcas-vehiculos.interface";
import {CategoriasVehiculosI} from "../../../../interfaces/catalogo-vehiculos/categorias-vehiculos.interface";
import {VehiculosService} from "../../../../services/vehiculos.service";
import {MarcasVehiculosService} from "../../../../services/marcas-vehiculos.service";
import {CategoriaVehiculosService} from "../../../../services/categoria-vehiculos.service";
import {DateConv} from "../../../../helpers/date-conv";
import {ClasesVehiculosI} from '../../../../interfaces/catalogo-vehiculos/clases-vehiculos.interface';
import {ClasesVehiculosService} from '../../../../services/clases-vehiculos.service';
import {CurrencyPipe} from '@angular/common';
import {TarifasApolloConfService} from '../../../../services/tarifas-apollo-conf.service';
import {TarifasCategoriasService} from '../../../../services/tarifas-categorias.service';
import {TarifasCategoriasI} from '../../../../interfaces/configuracion/tarifas-categorias.interface';

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

  public marcasV: MarcasVehiculosI[];
  public newMarcaV = false;
  @ViewChild('newMarcaI', {static: false}) newMarcaI: ElementRef;

  public categoriasV: CategoriasVehiculosI[];
  public newCatV = false;
  @ViewChild('newCatVI', {static: false}) newCatVI: ElementRef;

  public clasesV: ClasesVehiculosI[];

  vehiculoC = VehiculosC;

  tarifasCategorias: TarifasCategoriasI[];

  constructor(
    public modalCtrl: ModalController,
    private fb: FormBuilder,
    private vehiculosServ: VehiculosService,
    private generalServ: GeneralService,
    private sweetMsg: SweetMessagesService,
    private toastServ: ToastMessageService,
    private categoriaVehiculoServ: CategoriaVehiculosService,
    private marcasServ: MarcasVehiculosService,
    private classVehiculosServ: ClasesVehiculosService,
    private currencyPipe: CurrencyPipe,
    private tarifasApolloConfSer: TarifasApolloConfService,
    private tarifasCatServ: TarifasCategoriasService
  ) {
    this.title = 'Formulario Véhiculo';
    this.vehiculoForm = this.fb.group({
      id: [null],
      modelo: [null, Validators.required],
      modelo_ano: [null, Validators.required],
      marca_id: [null, Validators.required],
      placas: [null, Validators.required],
      num_poliza_seg: [null, Validators.required],
      km_recorridos: [null, Validators.required],
      categoria_vehiculo_id: [null, Validators.required],
      color: [null, Validators.required],
      version: [null, Validators.required],

      prox_servicio: [null],
      cant_combustible: [null],
      cap_tanque: [null],
      precio_renta: [null],
      activo: [null],
      codigo: [null],
      num_serie: [null, Validators.required],
      clase_id: [null, Validators.required],
      tarifa_categoria_id: [null, Validators.required]

    });
  }

  get vf() {
    return this.vehiculoForm.controls;
  }

  async ngOnInit() {
    this.loadMarcasV();
    this.loadCategoriasV();
    this.loadClasesV();
    this.loadTarifasCat();

    if (this.vehiculo_id) {
      await this.loadVehiculosData();
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

  loadCategoriasV() {
    this.categoriaVehiculoServ.getActive().subscribe(res => {
      if (res.ok === true) {
        this.categoriasV = res.categorias;
      }
    }, error =>  {
      console.log(error);
    })
  }

  loadClasesV() {
    this.classVehiculosServ.getActive().subscribe(res => {
      if (res.ok === true) {
        this.clasesV = res.datas;
      }
    }, error =>  {
      console.log(error);
    })
  }

  loadTarifasCat() {
    this.tarifasCatServ.getActive().subscribe(res => {
      if (res.ok) {
        this.tarifasCategorias = res.data;
      }
    }, error =>  {
      console.log(error);
    });
  }

  initVehiculoForm(data?) {
    console.log(data);
    this.vehiculoForm.setValue({
      id: (data && data.id) ? data.id : null,
      modelo: (data && data.modelo) ? data.modelo : null,
      modelo_ano: (data && data.modelo_ano) ? data.modelo_ano : null,
      marca_id: (data && data.marca_id) ? data.marca_id : null,
      placas: (data && data.placas) ? data.placas : null,
      num_poliza_seg: (data && data.num_poliza_seg) ? data.num_poliza_seg : null,
      km_recorridos: (data && data.km_recorridos) ? data.km_recorridos : null,
      categoria_vehiculo_id: (data && data.categoria_vehiculo_id) ? data.categoria_vehiculo_id : null,
      color: (data && data.color) ? data.color : null,
      version: (data && data.version) ? data.version : null,
      prox_servicio: (data && data.prox_servicio) ? data.prox_servicio : null,
      cant_combustible: (data && data.cant_combustible) ? data.cant_combustible : null,
      cap_tanque: (data && data.cap_tanque) ? data.cap_tanque : null,
      precio_renta: (data && data.precio_renta) ? data.precio_renta : null,
      activo: (data && data.activo) ? data.activo : 0,
      codigo: (data && data.codigo) ? data.codigo : null,
      num_serie: (data && data.num_serie) ? data.num_serie : null,
      clase_id: (data &&  data.clase_id) ? data.clase_id : null,
      tarifa_categoria_id: (data && data.tarifa_categoria_id) ? data.tarifa_categoria_id : null,
    });
    this.vf.activo.disable();
  }

  async loadVehiculosData() {

    await this.generalServ.presentLoading();
    this.vehiculosServ.getDataById(this.vehiculo_id).subscribe(async res => {
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

  setPrecioRenta() {
    let _tarifaCat = this.tarifasCategorias.find(x => x.id === this.vf.tarifa_categoria_id.value);
    if (-_tarifaCat) {
      this.vf.precio_renta.patchValue(_tarifaCat.precio_renta);
    }
  }

  saveUpdate() {
    if (this.vehiculoForm.invalid) {
      this.sweetMsg.printStatus('Debe llenar los campos requeridos', 'warning');
      this.vehiculoForm.markAllAsTouched();
      return;
    }

    let _payload = this.vehiculoForm.value;
    if (_payload.prox_servicio) {
      _payload.prox_servicio = DateConv.transFormDate(_payload.prox_servicio, 'regular');
    }
    console.log('payload --->', _payload);
    //return;
    this.generalServ.presentLoading('Guardando cambios ...');
    this.vehiculosServ.saveUpdate(_payload, this.vehiculo_id).subscribe(res => {
      this.generalServ.dismissLoading();
      this.dismiss(true);
      if (res.ok === true) {
        this.toastServ.presentToast('success', res.message, 'top');
      }
    }, error => {
      console.log(error);
      this.generalServ.dismissLoading();
      this.sweetMsg.printStatusArray(error.error.errors, 'error');
      return;
    });
  }

  dismiss(reload?) {
    this.modalCtrl.dismiss({
      reload
    });
  }

  saveNewMarca() {
    let _data = this.newMarcaI.nativeElement.value;
    if (_data) {
      this.generalServ.presentLoading();
      let payload = {
        marca: _data,
        tipo: 1
      }
      this.marcasServ.saveUpdate(payload).subscribe(res => {
        this.generalServ.dismissLoading();
        if (res.ok == true) {
          this.toastServ.presentToast('success', res.message, 'top');
          this.loadMarcasV();
          this.newMarcaV = false;
        }
      }, error => {
        console.log(error);
        this.generalServ.dismissLoading();
        this.toastServ.presentToast('error', error.error.errors[0], 'top');
        this.newMarcaV = false;
      });
    }
  }

  showNewMarca(show) {
    this.newMarcaV = show;
  }

  showNewCatV(show) {
    this.newCatV = show;
  }

  saveNewCatV() {
    let _data = this.newCatVI.nativeElement.value;
    if (_data) {
      this.generalServ.presentLoading();
      let payload = {
        categoria: _data
      }
      this.categoriaVehiculoServ.saveUpdate(payload).subscribe(res => {
        this.generalServ.dismissLoading();
        if (res.ok == true) {
          this.toastServ.presentToast('success', res.message, 'top');
          this.loadCategoriasV();
          this.newCatV = false;
        }
      }, error => {
        console.log(error);
        this.generalServ.dismissLoading();
        this.toastServ.presentToast('error', error.error.errors[0], 'top');
        this.newCatV = false;
      });
    }
  }
}

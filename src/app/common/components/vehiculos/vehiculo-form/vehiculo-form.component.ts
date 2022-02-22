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
import {TarifaApolloI} from '../../../../interfaces/tarifas/tarifa-apollo.interface';
import {CurrencyPipe} from '@angular/common';
import {error} from 'protractor';
import {TarifasApolloConfService} from '../../../../services/tarifas-apollo-conf.service';

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
  tarifaApolloPayload: TarifaApolloI[];
  applyTarifasRules = false;

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
    private tarifasApolloConfSer: TarifasApolloConfService
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

    });
  }

  get vf() {
    return this.vehiculoForm.controls;
  }

  async ngOnInit() {
    this.loadMarcasV();
    this.loadCategoriasV();
    this.loadClasesV();

    if (this.vehiculo_id) {
      await this.loadVehiculosData();
    } else {
      this.vehiculoData = null;
      this.initVehiculoForm();
      await this.initTarifaApolloObj();
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

  async initTarifaApolloObj(data?) {
    // TODO: pasar a una tabla configuración en DB
    if (data) {
      this.tarifaApolloPayload = null;
      this.tarifaApolloPayload = data;
      return;
    }
    await this.loadTarifaApolloConf();
    this.recalTarifaRow();
    /*this.tarifaApolloPayload = [
      {
        id: null,
        frecuencia: 'Día(s)',
        frecuencia_ref: 'days',
        activo: true,
        modelo: 'vehiculos',
        modelo_id: this.vehiculo_id ? this.vehiculo_id : null,
        precio_base: this.vf.precio_renta.value,
        precio_final_editable: false,
        ap_descuento: false,
        valor_descuento: null,
        descuento: null,
        precio_final: this.vf.precio_renta.value,
        required: true,
        errors: []
      },
      {
        id: null,
        frecuencia: 'Semana(s)',
        frecuencia_ref: 'weeks',
        activo: true,
        modelo: 'vehiculos',
        modelo_id: this.vehiculo_id ? this.vehiculo_id : null,
        precio_base:  this.vf.precio_renta.value,
        precio_final_editable: false,
        ap_descuento: true,
        valor_descuento: null,
        descuento: null,
        precio_final: this.vf.precio_renta.value,
        required: true,
        errors: []
      },
      {
        id: null,
        frecuencia: 'Mes(s)',
        frecuencia_ref: 'months',
        activo: true,
        modelo: 'vehiculos',
        modelo_id: this.vehiculo_id ? this.vehiculo_id : null,
        precio_base: this.vf.precio_renta.value,
        precio_final_editable: false,
        ap_descuento: true,
        valor_descuento: null,
        descuento: null,
        precio_final: this.vf.precio_renta.value,
        required: true,
        errors: []
      },
      {
        id: null,
        frecuencia: 'Hora Extra',
        frecuencia_ref: 'hours',
        activo: true,
        modelo: 'vehiculos',
        modelo_id: this.vehiculo_id ? this.vehiculo_id : null,
        precio_base: this.vf.precio_renta.value,
        precio_final_editable: true,
        ap_descuento: false,
        valor_descuento: null,
        descuento: null,
        precio_final: null,
        required: true,
        errors: []
      }
    ]*/
  }

  async loadTarifaApolloConf() {
    let res = await this.tarifasApolloConfSer._getActive();
    if (res.ok) {
      this.tarifaApolloPayload = [];
      for (let i = 0; i < res.data.length; i++) {
        this.tarifaApolloPayload.push(
            {
              id: null,
              frecuencia: res.data[i].frecuencia,
              frecuencia_ref: res.data[i].frecuencia_ref,
              activo: res.data[i].activo,
              modelo: 'vehiculos',
              modelo_id: this.vehiculo_id ? this.vehiculo_id : null,
              precio_base: this.vf.precio_renta.value,
              precio_final_editable: res.data[i].precio_final_editable,
              ap_descuento: res.data[i].ap_descuento,
              valor_descuento: res.data[i].valor_descuento,
              descuento: null,
              precio_final: this.vf.precio_renta.value,
              required: res.data[i].required,
              errors: []
            }
        )
      }
    }
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
      clase_id: (data &&  data.clase_id) ? data.clase_id : null
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
        // TODO: agregar data para initTarifaApolloObj
        let _tarifas = res.vehiculo.tarifas;
        await this.initTarifaApolloObj(_tarifas);
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
    if (this.reviewTarifaCapture() === false) {
      this.sweetMsg.printStatus('Se encontro información por verificar, revise las leyendas marcadas en rojo', 'warning');
      return;
    }

    let _payload = this.vehiculoForm.value;
    if (_payload.prox_servicio) {
      _payload.prox_servicio = DateConv.transFormDate(_payload.prox_servicio, 'regular');
    }
    _payload.tarifas_apollo = this.tarifaApolloPayload;
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

  recalTarifaRow(tarifaApollo?: TarifaApolloI) {
    console.log('recalTarifaRow');
    if (tarifaApollo) {
      let _valorDes = parseFloat(Number(tarifaApollo.valor_descuento / 100).toFixed(4));
      let _descuento = parseFloat(Number(tarifaApollo.precio_base * _valorDes).toFixed(4));
      let _total = parseFloat(Number(tarifaApollo.precio_base - _descuento).toFixed(4));

      tarifaApollo.descuento = _descuento;
      tarifaApollo.precio_final = _total;
    } else {
      if (this.tarifaApolloPayload && this.tarifaApolloPayload.length > 0) {
        for (let i = 0; i < this.tarifaApolloPayload.length; i++) {
          this.tarifaApolloPayload[i].precio_base = this.vf.precio_renta.value;

          let _valorDes = parseFloat(Number(this.tarifaApolloPayload[i].valor_descuento / 100).toFixed(4));
          let _descuento = parseFloat(Number(this.tarifaApolloPayload[i].precio_base * _valorDes).toFixed(4));
          let _total = parseFloat(Number(this.tarifaApolloPayload[i].precio_base - _descuento).toFixed(4));

          this.tarifaApolloPayload[i].descuento = _descuento;
          this.tarifaApolloPayload[i].precio_final = _total;

          if (this.tarifaApolloPayload[i].frecuencia_ref == 'hours') {
            this.tarifaApolloPayload[i].precio_final = parseFloat(Number(this.tarifaApolloPayload[i].precio_base / 7).toFixed(2));
          }
        }
      }
    }
    this.reviewTarifaCapture();
  }

  captureFinalPrice(tarifaApollo, event) {
    tarifaApollo.precio_final =  event.replace(/[$,]/g, "");
    console.log('typeof', typeof event);
    console.log(event);

    this.reviewTarifaCapture();
  }

  reviewTarifaCapture(): boolean {
    return true;
    let _haveErrors;
    if (this.tarifaApolloPayload && this.tarifaApolloPayload.length > 0) {
      for (let i = 0; i < this.tarifaApolloPayload.length; i++) {
        if (this.tarifaApolloPayload[i].required) {
          if (!this.tarifaApolloPayload[i].frecuencia || this.tarifaApolloPayload[i].frecuencia === '' || this.tarifaApolloPayload[i].frecuencia === 'undefined') {
            if (!this.tarifaApolloPayload[i].errors.find(x => x === 'Debe indicar una frecuencia valída')) {
              this.tarifaApolloPayload[i].errors.push('Debe indicar una frecuencia valída');
            }
          } else {
            this.tarifaApolloPayload[i].errors = [];
          }


          if (!this.tarifaApolloPayload[i].frecuencia_ref || this.tarifaApolloPayload[i].frecuencia_ref === '' || this.tarifaApolloPayload[i].frecuencia_ref === 'undefined') {
            if (!this.tarifaApolloPayload[i].errors.find(x => x === 'Debe indicar una referencia de frecuencia valída')) {
              this.tarifaApolloPayload[i].errors.push('Debe indicar una referencia de frecuencia valída');
            }
          } else {
            this.tarifaApolloPayload[i].errors = [];
          }

          if (!this.tarifaApolloPayload[i].modelo || this.tarifaApolloPayload[i].modelo === '' || this.tarifaApolloPayload[i].modelo === 'undefined') {
            if (!this.tarifaApolloPayload[i].errors.find(x => x === 'Debe indicar un modelo de datos correcto')) {
              this.tarifaApolloPayload[i].errors.push('Debe indicar un modelo de datos correcto');
            }
          } else {
            this.tarifaApolloPayload[i].errors = [];
          }

          if (!this.tarifaApolloPayload[i].modelo_id || this.tarifaApolloPayload[i].modelo_id == 0) {
            if (!this.tarifaApolloPayload[i].errors.find(x => x === 'Debe primero guardar la información del vehículo para proceder')) {
              this.tarifaApolloPayload[i].errors.push('Debe primero guardar la información del vehículo para proceder');
            }
          } else {
            this.tarifaApolloPayload[i].errors = [];
          }

          if (!this.tarifaApolloPayload[i].precio_base || this.tarifaApolloPayload[i].precio_base == 0) {
            if (!this.tarifaApolloPayload[i].errors.find(x => x === 'Debe indicar un precio base valído')) {
              this.tarifaApolloPayload[i].errors.push('Debe indicar un precio base valído');
            }
          } else {
            this.tarifaApolloPayload[i].errors = [];
          }

          if (this.tarifaApolloPayload[i].ap_descuento === true && !this.tarifaApolloPayload[i].valor_descuento || this.tarifaApolloPayload[i].valor_descuento == 0) {
            if (!this.tarifaApolloPayload[i].errors.find(x => x === 'Debe indicar un valor de descuento valído')) {
              this.tarifaApolloPayload[i].errors.push('Debe indicar un valor de descuento valído');
            }
          } else {
            this.tarifaApolloPayload[i].errors = [];
          }

          if (!this.tarifaApolloPayload[i].precio_final || this.tarifaApolloPayload[i].precio_final == 0) {
            if (!this.tarifaApolloPayload[i].errors.find(x => x === 'Debe indicar el precio final')) {
              this.tarifaApolloPayload[i].errors.push('Debe indicar el precio final');
            }
          } else {
            this.tarifaApolloPayload[i].errors = [];
          }

          if (this.tarifaApolloPayload[i].errors.length > 0) {
            _haveErrors = true;
          }
        }

      }
      if (_haveErrors === true) {
        return false;
      } else {
        return true
      }
    }
  }
}

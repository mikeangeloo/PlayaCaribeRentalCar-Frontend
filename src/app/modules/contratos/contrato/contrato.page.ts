import {AfterViewInit, Component, OnInit} from '@angular/core';
import {NgxMaterialTimepickerTheme} from "ngx-material-timepicker";
import {Months} from "../../../interfaces/shared/months";
import * as moment from "moment";
import {SweetMessagesService} from "../../../services/sweet-messages.service";
import {CardI} from "../../../interfaces/cards/card.interface";
import {TarjetaFormComponent} from "../../../common/components/tarjetas/tarjeta-form/tarjeta-form.component";
import {ModalController} from "@ionic/angular";
import {MultiTableFilterComponent} from "../../../common/components/multi-table-filter/multi-table-filter.component";
import {Form, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {DateConv} from "../../../helpers/date-conv";
import {SessionService} from "../../../services/session.service";
import {SucursalesI} from "../../../interfaces/sucursales.interface";
import {TxtConv} from "../../../helpers/txt-conv";
import {GeneralService} from "../../../services/general.service";
import {ContratosService} from "../../../services/contratos.service";
import {ContratoI} from "../../../interfaces/contratos/contrato.interface";
import {ContratosStatus} from "../../../enums/contratos-status.enum";
import {FilesService} from '../../../services/files.service';
import {DocDataTransfer} from '../../../interfaces/shared/doc-data-tranfer.interface';
import {VehiculosI} from '../../../interfaces/catalogo-vehiculos/vehiculos.interface';
import {TiposTarifasI} from '../../../interfaces/configuracion/tipos-tarifas.interface';
import {TiposTarifasService} from '../../../services/tipos-tarifas.service';
import {BehaviorSubject} from 'rxjs';
import {TarifasExtrasI} from '../../../interfaces/configuracion/tarifas-extras.interface';
import {TarifasExtrasService} from '../../../services/tarifas-extras.service';
import {DateTransform} from '../../../helpers/date-trans';
import {CobranzaI} from '../../../interfaces/contratos/cobranza-calc.interface';

@Component({
  selector: 'app-contrato',
  templateUrl: './contrato.page.html',
  styleUrls: ['./contrato.page.scss'],
})

export class ContratoPage implements OnInit, AfterViewInit {

  //#region STEP CONTROLLER ATTRIBUTES
  step = 0;
  //#endregion

  //#region DATOS GENERALES ATTRIBUTES
  generalDataForm: FormGroup;
  userSucursal: SucursalesI;
  num_contrato: string;
  contractData: ContratoI;
  public txtConv = TxtConv;
  public dateConv = DateConv;
  public statusC = ContratosStatus;


  contractType: string;
  //#endregion

  //#region DATOS CLIENTE ATTRIBUTES
  clienteDataForm: FormGroup;
  //#endregion

  //#region DATOS VEHICULO
  vehiculoData: VehiculosI;
  vehiculoForm: FormGroup;
  //#endregion

  //#region CLOCK PICKER ATTRIBUTES
  apolloThemClock: NgxMaterialTimepickerTheme = {
    container: {
      bodyBackgroundColor: '#f5c588',
      buttonColor: '#fff'
    },
    dial: {
      dialBackgroundColor: '#f09d28'
    },
    clockFace: {
      clockFaceBackgroundColor: '#f09d28',
      clockHandColor: '#606060',
      clockFaceTimeInactiveColor: '#fff',
    }
  };
  //#endregion

  //#region MONTHS, YEARS ATTRIBUTES
  public months = Months;
  public validYears: any[];
  public _today = DateConv.transFormDate(moment.now(), 'regular');
  //#endregion

  //#region IMAGES MANAGEMENT ATTRIBUTES
  public docDataTransfer: DocDataTransfer[] = [];
  public docPayLoad: {
    doc_type: 'licencia_conducir',
    model: 'clientes_docs',
    model_id: 'cliente_id'
  }
  //#endregion

  //#region COBRANZA ATTRIBUTES
  baseCurrency: 'USD' | 'MXN' = 'MXN';
  baseRentCost = 1500;
  baseRentFrequency: 'hours' | 'days' | 'weeks' | 'months' = 'days';
  fuelCharges = 1000;
  iva = 0.16;
  //aplicarIva: boolean;

  requiredAddCharges = [
    {
      label: 'DAÑOS MATERIALES 90%',
      cost: 52.35
    },
    {
      label: 'DAÑOS A TERCEROS',
      cost: 69.80
    },
    {
      label: 'GASTOS MEDICOS',
      cost: 34.90
    },
    {
      label: 'ASISTENCIA VIAL',
      cost: 17.45
    }
  ];

  tarifasExtras: TarifasExtrasI[];
  //selectedExtras: TarifasExtrasI[];
  //selectedExtrasIds: number[];

  public tiposTarifas: TiposTarifasI[];
  public _selectedTarifa: string;
  public cobranzaI: CobranzaI[] = [];

  //#endregion

  //#region SIGNATURE MANAGEMENT ATTRIBUTES
  public signature = '';
  //#endregion

  constructor(
    public sweetMsgServ: SweetMessagesService,
    public modalCtr: ModalController,
    public fb:  FormBuilder,
    public sessionServ: SessionService,
    public generalServ: GeneralService,
    public contratosServ: ContratosService,
    public filesServ: FilesService,
    public tiposTarifasServ: TiposTarifasService,
    public tarifasExtrasServ: TarifasExtrasService
  ) { }

  ngOnInit() {
    this.validYears = this.getYears();
    //this.initGeneralForm();

  }

  ionViewWillEnter() {
    console.log('view enter');
    this.loadTiposTarifas();
    this.loadTarifasExtras();

    // verificamos si tenemos guardado un contract_id en local storage para continuar con la edición
    if (this.contratosServ.getContractNumber()) {
      //this.contract_id = this.contratosServ.getContractData().id;
      this.num_contrato = this.contratosServ.getContractNumber();

      this.contratosServ.getContractData(this.num_contrato).subscribe(res => {
        if (res.ok) {
          this.contractData = res.data;
        }
      }, error => {
        console.log(error);
        this.sweetMsgServ.printStatusArray(error.error.errors, 'error');
        this.contratosServ.flushContractData();

        this.initGeneralForm();
        this.initClientForm();
        // TODO: cambiar por salida o llegada
        this.initVehiculoForm('salida');
      }).add(() => {
        if (this.contractData.etapas_guardadas && this.contractData.etapas_guardadas.length > 0) {
          let _datosGeneralesEtapa = this.contractData.etapas_guardadas.find(x => x === 'datos_generales');
          if (_datosGeneralesEtapa) {
            console.log('datos_generales');
            if (this.contractData.vehiculo) {
              this.vehiculoData = this.contractData.vehiculo;
            }
            this.initGeneralForm(this.contractData);

          } else {
            this.initGeneralForm();
          }

          let _datosClienteEtapa = this.contractData.etapas_guardadas.find(x => x === 'datos_cliente');
          if (_datosClienteEtapa) {
            console.log('datos_cliente');
            let _clientesPayload = this.contractData.cliente;
            this.initClientForm(_clientesPayload);
            this.getDocs('licencia_conducir', 'clientes_docs', 'cliente_id', _clientesPayload.id);
          } else {
            this.initClientForm();
          }

          /*let _datosVehiculoEtapa = this.contractData.etapas_guardadas.find(x => x === 'datos_vehiculo');
          if (_datosVehiculoEtapa) {
            console.log('datos_vehiculo');
            this.vehiculoData = this.contractData.vehiculo;
            console.log('vehiculoData', this.vehiculoData);
            // TODO: cambiar por salida o llegada
            this.initVehiculoForm('salida', this.contractData);
          } else {
            this.initVehiculoForm('salida');
          }*/
        }
      });
    } else {
      this.initGeneralForm();
      this.initClientForm();
      // TODO: cambiar por salida o llegada
      this.initVehiculoForm('salida');
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initReviewCanva();
    }, 1000);
  }

  //#region GENERAL FUNCTIONS
  private getYears() {
    const years = [];
    const dateStart = moment();
    const dateEnd = moment().add(10, 'y');
    while (dateEnd.diff(dateStart, 'years') >= 0) {
      years.push(dateStart.format('YYYY'));
      dateStart.add(1, 'year');
    }
    return years;
  }
  //#endregion

  //#region GENERAL FORM FUNCTIONS
  initGeneralForm(data?: ContratoI) {
    let _todayHour = DateConv.transFormDate(moment.now(), 'time');
    let _usrProfile = this.sessionServ.getProfile();
    if (_usrProfile && _usrProfile.sucursal) {
      this.userSucursal = _usrProfile.sucursal;
    } else {
      this.userSucursal = {
        id: null,
        codigo: null,
        direccion: null
      };
    }

    this.generalDataForm = this.fb.group({
      num_contrato: [(data && data.num_contrato ? data.num_contrato : null)],
      vehiculo_id: [(data && data.vehiculo && data.vehiculo.id ? data.vehiculo.id : (this.vehiculoData && this.vehiculoData.id) ? this.vehiculoData.id : null), Validators.required],
      tipo_tarifa_id: [(data && data.tipo_tarifa_id) ? data.tipo_tarifa_id : null, Validators.required],
      tipo_tarifa: [(data && data.tipo_tarifa) ? data.tipo_tarifa : null, Validators.required],
      precio_unitario_inicial: [(data && data.precio_unitario_inicial ? data.precio_unitario_inicial : null)],
      precio_unitario_final: [(data && data.precio_unitario_final) ? data.precio_unitario_final : null],

      rango_fechas: this.fb.group({
        fecha_salida: [(data && data.fecha_salida ? data.fecha_salida : this._today), Validators.required],
        fecha_retorno: [(data && data.fecha_retorno ? data.fecha_retorno : null), Validators.required],
      }),

      cobros_extras_ids: [(data && data.cobros_extras_ids ? data.cobros_extras_ids : null)],
      cobros_extras: [(data && data.cobros_extras ? data.cobros_extras : null)],
      subtotal: [(data && data.subtotal ? data.subtotal : null), Validators.required],
      descuento: [(data && data.descuento ? data.descuento : null)],
      con_iva: [(data && data.con_iva ? data.con_iva : null)],
      iva: [(data && data.iva ? data.iva : null)],
      iva_monto: [(data && data.iva_monto ? data.iva_monto : null)],
      total: [(data && data.total ? data.total : null), Validators.required],

      cobranza_calc: [(data && data.cobranza_calc ? data.cobranza_calc : null), Validators.required],

      total_dias: [(data && data.total_dias) ? data.total_dias : null, Validators.required],
      ub_salida_id: [(data && data.ub_salida_id) ? data.ub_salida_id : 1, Validators.required],
      ub_retorno_id: [(data && data.ub_retorno_id) ? data.ub_retorno_id : 1, Validators.required],
    });

    // if (data && data.cobros_extras && data.cobros_extras.length > 0) {
    //   this.selectedExtras = data.cobros_extras;
    //   console.log('selectedExtras --->', this.selectedExtras);
    // }
    // this.gf.renta_of_codigo.disable();
    // this.gf.retorno_of_codigo.disable();

    console.log('init', this.generalDataForm.controls);

    if (data && data.cobranza_calc && data.cobranza_calc.length) {
      this.cobranzaI = data.cobranza_calc;
    }
  }

  initRentOfData(data) {
    this.generalDataForm.controls.renta_of_id.setValue((data && data.id ? data.id : null));
    this.generalDataForm.controls.renta_of_codigo.setValue((data && data.codigo ? data.codigo : null));
    this.generalDataForm.controls.renta_of_dir.setValue((data && data.direccion ? data.direccion : null));

    if (!this.generalDataForm.controls.renta_of_fecha.value) {
      this.generalDataForm.controls.renta_of_fecha.setValue((data && data.renta_of_fecha ? data.renta_of_fecha : null));
    }

    if (!this.generalDataForm.controls.renta_of_hora.value) {
      this.generalDataForm.controls.renta_of_hora.setValue((data && data.renta_of_hora ? data.renta_of_hora : null));
    }
  }

  initReturnOfData(data) {
    this.generalDataForm.controls.retorno_of_id.setValue((data && data.id ? data.id : null));
    this.generalDataForm.controls.retorno_of_codigo.setValue((data && data.codigo ? data.codigo : null));
    this.generalDataForm.controls.retorno_of_dir.setValue((data && data.direccion ? data.direccion : null));

    if (!this.generalDataForm.controls.retorno_of_fecha.value) {
      this.generalDataForm.controls.retorno_of_fecha.setValue((data && data.retorno_of_fecha ? data.retorno_of_fecha : null));
    }

    if (!this.generalDataForm.controls.retorno_of_hora.value) {
      this.generalDataForm.controls.retorno_of_hora.setValue((data && data.retorno_of_hora ? data.retorno_of_hora : null));
    }
  }

  loadTiposTarifas() {
    this.tiposTarifasServ.getActive().subscribe(res => {
      if (res.ok) {
        this.tiposTarifas = res.data;
      }
    }, error =>  {
      console.log('tipos tarifas err -->', error);
    })
  }

  loadTarifasExtras() {
    this.tarifasExtrasServ.getActive().subscribe(res => {
      if (res.ok) {
        this.tarifasExtras = res.datas;
      }
    }, error => {
      console.log('tipos tarifas extras err -->', error);
    })
  }

  get gf() {
    return this.generalDataForm.controls;
  }
  get rangoFechas() {
    return this.gf.rango_fechas['controls'];
  }
  //#endregion

  //#region CLIENT FORM FUNCTIONS
  initClientForm(data?) {
    this.clienteDataForm = this.fb.group({
      cliente_id: [(data && data.id ? data.id : null)],
      nombre: [(data && data.nombre ? data.nombre: null), Validators.required],
      apellidos: [(data && data.apellidos ? data.apellidos: null), Validators.required],
      telefono: [(data && data.telefono ? data.telefono: null), Validators.required],
      email: [(data && data.email ? data.email: null), [Validators.required, Validators.email]],
      direccion: [(data && data.direccion ? data.direccion: null), Validators.required],
      num_licencia: [(data && data.num_licencia ? data.num_licencia: null), Validators.required],
      licencia_mes: [(data && data.licencia_mes ? data.licencia_mes: null), Validators.required],
      licencia_ano: [(data && data.licencia_ano ? data.licencia_ano: null), Validators.required],
    });
  }

  get cf() {
    return this.clienteDataForm.controls;
  }

  //#endregion

  //#region VEHICULO FORM FUNCTIONS
  /**
   * @deprecated
   * */
  initVehiculoForm(tipo: 'salida' | 'llegada', data?) {
    this.vehiculoForm = this.fb.group({
      vehiculo_id: [(this.vehiculoData && this.vehiculoData.id ? this.vehiculoData.id : null), Validators.required],
      km_salida: [(data && data.km_salida ? data.km_salida: null), Validators.required],
      km_llegada: [(data && data.km_llegada ? data.km_llegada: null), Validators.required],
      km_recorrido: [(data && data.km_recorrido ? data.km_recorrido: null), Validators.required],
      gas_salida: [(data && data.gas_salida ? data.gas_salida: null), [Validators.required]],
      gas_llegada: [(data && data.gas_llegada ? data.gas_llegada: null), Validators.required],
    });
    if (tipo === 'salida') {
      this.vehiculoForm.controls.km_llegada.disable();
      this.vehiculoForm.controls.km_recorrido.disable();
      this.vehiculoForm.controls.gas_llegada.disable();
    }
    if (tipo === 'llegada') {
      this.vehiculoForm.controls.km_salida.disable();
      this.vehiculoForm.controls.gas_salida.disable();
    }
  }

  get vf() {
    return this.vehiculoForm.controls;
  }
  //#endregion

  //#region REVIEW MANAGEMENT FUNCTIONS
  initReviewCanva() {
    // @ts-ignore
    let canvas: HTMLCanvasElement = document.getElementById('revisionC');
    let ctx = canvas.getContext("2d");

    let _width = document.getElementById('revisionRowW').offsetWidth;
    let _fixHeight = 200;
    if (window.innerWidth <= 768) {
      _fixHeight = 500;
    }
    let _height = document.body.offsetHeight - _fixHeight;

    console.log('_height', _height);

    canvas.width = _width;
    canvas.height = _height;


    var background = new Image();
    background.src = 'assets/img/svg/sedan.svg';

    background.onload = function(){
      ctx.drawImage(background,0,0);
    }
  }
  //#endregion

  //#region STEEPER MANAGEMENT FUNCTIONS
  setStep(index: number) {
    this.step = index;
  }

  async nextStep() {
    this.step++;
  }

  async prevStep() {
    this.step--;
  }
  //#endregion

  //#region CAPTURE IMG FUNCTIONS
  processDataImage(event: {imgUrl: string, image: File, type: string, fileName: string}) {

    this.docDataTransfer.push({
      file: event.image,
      url: event.imgUrl,
      uploading: false,
      success: null,
      mime_type: event.type,
      fileName: event.fileName
    });

    console.log('docDataTranfer', this.docDataTransfer);

  }

  disableUploadButton(): boolean {
    if (!this.docDataTransfer) {
      return true;
    }

    if (this.docDataTransfer && this.docDataTransfer.length > 0) {
      for (let i = 0; i < this.docDataTransfer.length; i++) {
        if (!this.docDataTransfer[i].success || !this.docDataTransfer[i].file_id || this.docDataTransfer[i].success === false) {
          return false;
        }
      }
    }
    return true;
  }

  uploadArrayDatasImg(doc_type = this.docPayLoad.doc_type, model = this.docPayLoad.model, model_id = this.docPayLoad.model_id) {
    if (!this.clienteDataForm.controls.cliente_id.value) {
      this.sweetMsgServ.printStatus('Debe primero guardar el avance de la información capturada del cliente', 'warning');
      return;
    }
    if (this.docDataTransfer.length === 0 ) {
      this.sweetMsgServ.printStatus('Debe adjuntar una imagen', 'warning');
      return;
    }

    //this.sweetMsgServ.printStatus('Función en desarrollo', 'warning');
    //return;

    this.sweetMsgServ.confirmRequest().then(async (data) => {
      if (data.value) {

        console.log('here');
        let _lastServError = null;
        let formData = new FormData();
        let _positions = [];
        let _etiquetas = [];
        for (let i = 0; i< this.docDataTransfer.length; i++) {
          console.log('prepare formData info---->');

          if (!this.docDataTransfer[i].success || this.docDataTransfer[i].success === false || !this.docDataTransfer[i].file_id || this.docDataTransfer[i].file_id === null) {
            //this.docDataTransfer[i].uploading = false;
            if (!this.docDataTransfer[i].etiqueta) {
              this.docDataTransfer[i].fileErrors = 'Ingrese un valor valido';

            } else {
              this.docDataTransfer[i].fileErrors = null;
            }

            if (this.docDataTransfer[i].fileErrors) {
              this.sweetMsgServ.printStatus('Revise que los elementos esten correctos', 'warning');
              return;
            }
            // @ts-ignore
            formData.append('files[]', this.docDataTransfer[i].file, this.docDataTransfer[i].file.name);
            //this.docDataTransfer[i].uploading = true;
            _positions.push(i);
            _etiquetas.push(this.docDataTransfer[i].etiqueta);
          }
        }

        formData.set('doc_type', doc_type);
        formData.set('model', model);
        formData.set('model_id', model_id);
        formData.set('model_id_value', String(this.clienteDataForm.controls.cliente_id.value));
        formData.set('positions', JSON.stringify(_positions));
        formData.set('etiquetas', JSON.stringify(_etiquetas));

        if (formData.has('files[]') === false) {
          return;
        }

        let res = await this.filesServ.storeDocs(formData);
        let _lastIndex = 0;
        if (res.ok === true) {

          let _resPayload = res.payload;

          for (let i = 0; i < _resPayload.length; i++) {
            this.docDataTransfer[_resPayload[i].position].success = _resPayload[i].success;
            this.docDataTransfer[_resPayload[i].position].file_id = _resPayload[i].file_id;
            this.docDataTransfer[_resPayload[i].position].model = _resPayload[i].model;
            this.docDataTransfer[_resPayload[i].position].model_id = _resPayload[i].model_id;
            this.docDataTransfer[_resPayload[i].position].model_id_value = _resPayload[i].model_id_value;
            this.docDataTransfer[_resPayload[i].position].position = _resPayload[i].position;
            this.docDataTransfer[_resPayload[i].position].doc_type = _resPayload[i].doc_type;
            _lastIndex = i;
          }
        } else {
          _lastServError = res.error.errors;
        }

        console.log('imgDatasTranfer -->', this.docDataTransfer);

        let successTotal = 0;
        for (let j = 0; j < this.docDataTransfer.length; j++) {
          if (this.docDataTransfer[j].success === true) {
            successTotal ++;
          }
        }
        if (successTotal === this.docDataTransfer.length) {
          console.log('all saved');
          this.sweetMsgServ.printStatus('Se han guardado sus imagenes de manera correcta', 'success');
        } else {
          console.log('error', _lastServError);
          if (_lastServError) {
            this.sweetMsgServ.printStatusArray(_lastServError, 'error');
          } else {
            this.sweetMsgServ.printStatus('Se produjo un error al guardar una de sus imagenes, intentelo nuevamente o eliminela de la cola', 'error');
          }
        }
      }
    });
  }

  removeImg(index) {
    this.docDataTransfer.splice(index, 1);
  }

  async removeFromDisk(fileData: DocDataTransfer, index) {
    await this.sweetMsgServ.confirmRequest('¿Estás seguro de querer eliminar el archivo?').then(async (data) => {
      if (data.value) {
        let _payload = {
          doc_type: fileData.doc_type,
          model: fileData.model,
          model_id: fileData.model_id,
          model_id_value: fileData.model_id_value,
          id: fileData.file_id
        }
        let query = await this.filesServ.deleteDoc(_payload);
        if (query.ok) {
          this.sweetMsgServ.printStatus(query.data.message, 'success');
          this.removeImg(index);
        } else {
          this.sweetMsgServ.printStatusArray(query.error.error.errors, 'error');
          console.log(query.error);
        }
      }
    });
  }

  async getDocs(doc_type = this.docPayLoad.doc_type, model = this.docPayLoad.model, model_id = this.docPayLoad.model_id, model_id_value: number) {
    let _payload = {
      doc_type,
      model,
      model_id,
      model_id_value
    }
    let res = await this.filesServ.getDocs(_payload);

    if (res.ok) {
      this.docDataTransfer = [];
      for (let i = 0; i < res.data.length; i++) {
        let _docData: DocDataTransfer = {
          position: res.data[i].position,
          success: res.data[i].success,
          file_id: res.data[i].file_id,
          doc_type: res.data[i].doc_type,
          model: res.data[i].model,
          model_id: res.data[i].model_id,
          mime_type: res.data[i].mime_type,
          url: res.data[i].file,
          model_id_value: res.data[i].model_id_value,
          etiqueta: res.data[i].etiqueta
        }
        this.docDataTransfer.push(_docData);
      }
    } else {
      this.docDataTransfer = [];
      console.log('error --->', res.error);
    }
  }

  isImage(fileType: string): boolean {
    let imgTypes = ['image/png', 'image/jpg', 'image/jpeg'];
    let find = imgTypes.find(x => x === fileType);
    return find && find !== 'unknown';
  }
  //#endregion

  //#region CARDS MANAGEMENT
  async openTarjetaForm(_data?: CardI) {
    //const pageEl: HTMLElement = document.querySelector('.ion-page');
    //this.generalService.presentLoading();
    const modal = await this.modalCtr.create({
      component: TarjetaFormComponent,
      componentProps: {
        'asModal': true,
        'justCapture': true
      },
      swipeToClose: true,
      cssClass: 'edit-form',
      //presentingElement: pageEl
    });
    await modal.present();
    const {data} = await modal.onWillDismiss();
    if (data.reload && data.reload === true) {
      //this.loadClienteData();
    }
  }
  //#endregion

  //#region SIGNATURE MANAGEMENT
  captureSignature(e){
    this.signature = e;
  }
  //#endregion

  //#region MODAL SEARCH MANAGEMENT
  async openModalSearch(_endpoint: string, section: string) {
    //const pageEl: HTMLElement = document.querySelector('.ion-page');
    //this.generalService.presentLoading();
    const modal = await this.modalCtr.create({
      component: MultiTableFilterComponent,
      componentProps: {
        'asModal': true,
        'endpoint': _endpoint
      },
      swipeToClose: true,
      cssClass: 'edit-form',
      //presentingElement: pageEl
    });
    await modal.present();
    const {data} = await modal.onWillDismiss();
    if (data) {
      console.log(data);
      switch (section) {
        case 'renta_of':
          this.initRentOfData(data);
          break;
        case 'retorno_of':
          this.initReturnOfData(data);
          break;
        case 'cliente':
          this.initClientForm(data);
          this.getDocs('licencia_conducir', 'clientes_docs', 'cliente_id', data.id);
          break;
        case 'vehiculo':
          // TODO: arreglar cuando sea tipo salida o llegada
          this.vehiculoData = data;
          this.gf.vehiculo_id.patchValue(this.vehiculoData.id);
          this.initVehiculoForm('salida', data);
          break;
      }
      //this.loadClienteData();
    }
  }
  //#endregion

  //#region CALCULATION BUSINESS RULES

  changeTipoTarifa() {
    let _tipoTarifa = this.tiposTarifas.find(x => x.tarifa === this.gf.tipo_tarifa.value);
    this.gf.tipo_tarifa_id.patchValue(_tipoTarifa.id);
    this.startDateChange();
    this.setReturnDateChange();
  }

  startDateChange() {
    console.log('startDateChange');
    this.rangoFechas.fecha_salida.patchValue(this._today);
  }

  setReturnDateChange() {
    console.log('setReturnDateChange');
    if (this.rangoFechas.fecha_retorno.invalid) {
      this.rangoFechas.fecha_retorno.markAllAsTouched();
      return;
    }
    this.gf.total_dias.patchValue(DateConv.diffDays(this.rangoFechas.fecha_salida.value, this.rangoFechas.fecha_retorno.value));

    this.makeCalc();
  }

  pushSelectedExtras() {
    let _ids = this.gf.cobros_extras_ids.value;
    this.gf.cobros_extras.setValue(null);
    let _extrasObj = []
    for (let i = 0; i < _ids.length; i ++) {
      let _extra = this.tarifasExtras.find(x => x.id == _ids[i]);
      if (_extra) {
       _extrasObj.push(_extra);
      }
    }
    if (_extrasObj && _extrasObj.length > 0) {
      this.gf.cobros_extras.setValue(_extrasObj);
    }
    this.makeCalc();
  }

  makeCalc(elementType?: string, cobro?: CobranzaI) {
    if (this.gf.tipo_tarifa.invalid) {
      this.sweetMsgServ.printStatus('Selecciona el tipo de tarífa', 'warning');
      this.gf.tipo_tarifa.markAllAsTouched();
      return;
    }
    this.cobranzaI = [];
    switch (TxtConv.txtCon(this.gf.tipo_tarifa.value, 'uppercase')) {
      case 'APOLLO':
        console.log('tipo de tarifa apollo');
        if (!this.vehiculoData.tarifas) {
          console.log('El vehículo seleccionado no cuenta con un plan tarifario, comuniquese con el administrador');
          this.sweetMsgServ.printStatus('El vehículo seleccionado no cuenta con un plan tarifario, comuniquese con el administrador', 'error');
          return;
        }
        let _tarifas = this.vehiculoData.tarifas;

        this.gf.precio_unitario_inicial.patchValue(this.vehiculoData.precio_renta);
        this.gf.precio_unitario_final.patchValue(this.vehiculoData.precio_renta);

        let _totalDias = this.gf.total_dias.value;
        if (_totalDias < 7) {
          this.baseRentFrequency = 'days';
        } else if (_totalDias >= 7 && _totalDias < 30) {
          this.baseRentFrequency = 'weeks';
        } else if (_totalDias >= 30) {
          this.baseRentFrequency = 'months';
        }

        let _tarifa = _tarifas.find(x => x.frecuencia_ref == this.baseRentFrequency);
        console.log('tarifa baseRentFrequency -->', this.baseRentFrequency);
        console.log('tarifa select -->', _tarifa);

        this.cobranzaI.push({
          element: 'renta',
          value: _tarifa.precio_base,
          quantity: _totalDias,
          quantity_type: 'dias',
          element_label: 'Renta',
          number_sign: 'positive',
          amount: parseFloat(Number(_tarifa.precio_base * _totalDias).toFixed(2)),
          currency: this.baseCurrency
        });

        // Verificamos si tenemos descuento
        if (_tarifa.ap_descuento == true) {
          this.cobranzaI.push({
            element: 'descuento',
            value: null,
            quantity: _tarifa.valor_descuento,
            quantity_type: '%',
            element_label: 'Descuento',
            number_sign: 'negative',
            amount: parseFloat(Number(_tarifa.precio_base * (_tarifa.valor_descuento / 100) * _totalDias).toFixed(2)),
            currency: this.baseCurrency
          })
        }
        break;
      default:
        this.gf.tipo_tarifa.markAllAsTouched();
      return
    }

    // Verificamos si tenemos extras
    if (this.gf.cobros_extras.value && this.gf.cobros_extras.value.length > 0) {
      for (let i = 0; i < this.gf.cobros_extras.value.length; i++) {
        this.cobranzaI.push({
          element: (elementType && elementType === 'extra' && cobro) ? cobro.element : 'extra',
          value: (elementType && elementType === 'extra' && cobro) ? cobro.value : this.gf.cobros_extras.value[i].precio,
          quantity: (elementType && elementType === 'extra' && cobro) ? cobro.quantity : 1,
          quantity_type: (elementType && elementType === 'extra' && cobro) ? cobro.quantity_type : '',
          element_label: (elementType && elementType === 'extra' && cobro) ? cobro.element_label : this.gf.cobros_extras.value[i].nombre,
          number_sign: (elementType && elementType === 'extra' && cobro) ? cobro.number_sign : 'positive',
          amount: (elementType && elementType === 'extra' && cobro) ? parseFloat(Number(this.gf.cobros_extras.value[i].precio * cobro.quantity).toFixed(2)) : parseFloat(Number(this.gf.cobros_extras.value[i].precio * 1).toFixed(2)),
          currency: this.baseCurrency
        })
      }
    }

    // sacamos subtotal, iva y total final
    let _subtotal = 0;
    let _iva = 0;
    let _total = 0;
    for (let i = 0; i < this.cobranzaI.length; i ++) {
      _subtotal = _subtotal + ((this.cobranzaI[i].amount * (this.cobranzaI[i].number_sign === 'positive' ? 1 : -1)));
    }
    if (this.gf.con_iva.value) {
      _iva = parseFloat(Number(_subtotal * this.iva).toFixed(2));
      _total = (_subtotal + _iva);
    } else {
      _total = (_subtotal);
    }


    // subtotal
    this.cobranzaI.push({
      element: 'subtotal',
      value: null,
      quantity: null,
      quantity_type: null,
      element_label: 'Subtotal',
      number_sign: 'positive',
      amount: _subtotal,
      currency: this.baseCurrency
    });
    this.gf.subtotal.patchValue(_subtotal);

    // revisamos descuento
    let _des = this.cobranzaI.filter(x => x.element === 'descuento');
    let _desTotal = 0;
    if (_des) {
      for (let i = 0; i < _des.length; i++) {
        _desTotal = (_desTotal + _des[i].amount);
      }
      this.gf.descuento.patchValue(_desTotal);
    }

    // iva
    if (this.gf.con_iva.value) {
      this.cobranzaI.push({
        element: 'iva',
        value: null,
        quantity: this.iva * 100,
        quantity_type: '%',
        element_label: 'IVA',
        number_sign: 'positive',
        amount: _iva,
        currency: this.baseCurrency
      });
      //this.gf.con_iva.patchValue(true);
      this.gf.iva.patchValue(this.iva);
      this.gf.iva_monto.patchValue(_iva);
    }

    // total
    this.cobranzaI.push({
      element: 'total',
      value: null,
      quantity: null,
      quantity_type: null,
      element_label: 'Total',
      number_sign: 'positive',
      amount: _total,
      currency: this.baseCurrency
    });
    this.gf.total.patchValue(_total);
    this.gf.cobranza_calc.patchValue(this.cobranzaI);
  }
  //#endregion

  saveProcess(section: 'datos_generales' | 'datos_cliente' | 'datos_vehiculo') {
    //this.sweetMsgServ.printStatus('Acción en desarrollo', 'warning');
    console.log('section', section);
    let _payload;
    switch (section) {
      case 'datos_generales':
        if (this.generalDataForm.invalid) {
          this.sweetMsgServ.printStatus('Verifica que los datos solicitados esten completos', 'warning');
          this.generalDataForm.markAllAsTouched();
          console.log(this.generalDataForm);
          return;
        }
        _payload = this.generalDataForm.value;
        if (moment.isMoment(_payload.rango_fechas.fecha_salida)) {
          _payload.rango_fechas.fecha_salida = DateConv.transFormDate(_payload.rango_fechas.fecha_salida, 'regular');
        }
        if (moment.isMoment(_payload.rango_fechas.fecha_retorno)) {
          _payload.rango_fechas.fecha_retorno = DateConv.transFormDate(_payload.rango_fechas.fecha_retorno, 'regular');
        }
        _payload.hora_elaboracion = DateConv.transFormDate(moment.now(), 'time');
        break;
      case 'datos_cliente':
        if (this.clienteDataForm.invalid) {
          this.sweetMsgServ.printStatus('Verifica que los datos solicitados esten completos', 'warning');
          this.clienteDataForm.markAllAsTouched();
          return;
        }
        _payload = this.clienteDataForm.value;
        break;
      case 'datos_vehiculo':
        if (this.vehiculoForm.invalid) {
          this.sweetMsgServ.printStatus('Verifica que los datos solicitados esten completos', 'warning');
          this.vehiculoForm.markAllAsTouched();
          console.log('invalid form vehiculoForm', this.vehiculoForm);
          return;
        }
        _payload = this.vehiculoForm.value;
        break;
    }

    _payload.seccion = section;
    _payload.num_contrato = this.num_contrato;
    console.log(section + '--->', _payload);

    this.contratosServ.saveProgress(_payload).subscribe(res => {
      if (res.ok) {
        this.sweetMsgServ.printStatus(res.message, 'success');
        //this.contract_id = res.id;
        this.num_contrato = res.contract_number;
        this.contratosServ.setContractData(this.num_contrato);
      }
    }, error => {
      console.log(error);
      this.sweetMsgServ.printStatusArray(error.error.errors, 'error');
    })
  }

  resetAll() {
    this.docDataTransfer = [];
  }

}

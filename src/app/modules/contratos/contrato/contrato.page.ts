import {AfterViewInit, Component, OnInit} from '@angular/core';
import {NgxMaterialTimepickerTheme} from "ngx-material-timepicker";
import {Months} from "../../../interfaces/shared/months";
import * as moment from "moment";
import {SweetMessagesService} from "../../../services/sweet-messages.service";
import {CardI} from "../../../interfaces/cards/card.interface";
import {TarjetaFormComponent} from "../../../common/components/tarjetas/tarjeta-form/tarjeta-form.component";
import {ModalController} from "@ionic/angular";
import {MultiTableFilterComponent} from "../../../common/components/multi-table-filter/multi-table-filter.component";
import {Form, FormBuilder, FormGroup, Validators} from "@angular/forms";
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
  //#endregion

  //#region IMAGES MANAGEMENT ATTRIBUTES
  public docDataTransfer: DocDataTransfer[] = [];
  public docPayLoad: {
    doc_type: 'licencia_conducir',
    model: 'clientes_docs',
    model_id: 'cliente_id'
  }
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
    public filesServ: FilesService
  ) { }

  ngOnInit() {
    this.validYears = this.getYears();
    //this.initGeneralForm();

  }

  ionViewWillEnter() {
    console.log('view enter');


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
      }).add(() => {
        if (this.contractData.etapas_guardadas && this.contractData.etapas_guardadas.length > 0) {
          let _datosGeneralesEtapa = this.contractData.etapas_guardadas.find(x => x === 'datos_generales');
          if (_datosGeneralesEtapa) {
            console.log('datos_generales');
            this.initGeneralForm(this.contractData);
          } else {
            this.initGeneralForm();
          }

          let _datosClienteEtapa = this.contractData.etapas_guardadas.find(x => x === 'datos_cliente');
          if (_datosClienteEtapa) {
            console.log('datos_cliente');
            let _clientesPayload = this.contractData.cliente;
            this.initClientForm(_clientesPayload);
            this.getDocs('licencia_conducir', 'clientes_docs', 'cliente_id');
          } else {
            this.initClientForm();
          }

          let _datosVehiculoEtapa = this.contractData.etapas_guardadas.find(x => x === 'datos_vehiculo');
          if (_datosVehiculoEtapa) {
            console.log('datos_vehiculo');
            this.vehiculoData = this.contractData.vehiculo;
            console.log('vehiculoData', this.vehiculoData);
            // TODO: cambiar por salida o llegada
            this.initVehiculoForm('salida', this.contractData);
          } else {
            this.initVehiculoForm('salida');
          }
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
  initGeneralForm(data?) {
    let _today = DateConv.transFormDate(moment.now(), 'regular');
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
      renta_of_id: [(data && data.renta_of_id ? data.renta_of_id : this.userSucursal.id), Validators.required],
      renta_of_codigo: [(data && data.renta_of_codigo ? data.renta_of_codigo : this.userSucursal.codigo), [Validators.required]],
      renta_of_dir: [(data && data.renta_of_dir ? data.renta_of_dir : this.userSucursal.direccion), Validators.required],
      renta_of_fecha: [(data && data.renta_of_fecha ? data.renta_of_fecha : _today), Validators.required],
      renta_of_hora: [(data && data.renta_of_hora ? data.renta_of_hora : _todayHour), Validators.required],

      retorno_of_id: [(data && data.retorno_of_id ? data.retorno_of_id : null), Validators.required],
      retorno_of_codigo: [(data && data.retorno_of_codigo ? data.retorno_of_codigo : null), Validators.required],
      retorno_of_dir: [(data && data.retorno_of_dir ? data.retorno_of_dir : null), Validators.required],
      retorno_of_fecha: [(data && data.retorno_of_fecha ? data.retorno_of_fecha : null), Validators.required],
      retorno_of_hora: [(data && data.retorno_of_hora ? data.retorno_of_hora : null), Validators.required],
    });

    // this.gf.renta_of_codigo.disable();
    // this.gf.retorno_of_codigo.disable();
    console.log('init', this.generalDataForm.controls);
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

  get gf() {
    return this.generalDataForm.controls;
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
            //this.docDataTransfer[_resPayload[i].position].uploading = false;
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

  async getDocs(doc_type = this.docPayLoad.doc_type, model = this.docPayLoad.model, model_id = this.docPayLoad.model_id) {
    let _payload = {
      doc_type,
      model,
      model_id,
      model_id_value: this.clienteDataForm.controls.cliente_id.value
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
          break;
        case 'vehiculo':
          // TODO: arreglar cuando sea tipo salida o llegada
          this.vehiculoData = data;
          this.initVehiculoForm('salida', data);
          break;
      }
      //this.loadClienteData();
    }
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
          return;
        }
        _payload = this.generalDataForm.value;
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
    //return;

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

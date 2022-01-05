import {AfterViewInit, Component, OnInit} from '@angular/core';
import {NgxMaterialTimepickerTheme} from "ngx-material-timepicker";
import {Months} from "../../../interfaces/shared/months";
import * as moment from "moment";
import {ImgDataTranferI} from "../../../interfaces/shared/img-data-tranfer.interface";
import {SweetMessagesService} from "../../../services/sweet-messages.service";
import {CardI} from "../../../interfaces/cards/card.interface";
import {TarjetaFormComponent} from "../../../common/components/tarjetas/tarjeta-form/tarjeta-form.component";
import {ModalController} from "@ionic/angular";
import {MultiTableFilterComponent} from "../../../common/components/multi-table-filter/multi-table-filter.component";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DateConv} from "../../../helpers/date-conv";
import {SessionService} from "../../../services/session.service";
import {SucursalesI} from "../../../interfaces/sucursales.interface";
import {TxtConv} from "../../../helpers/txt-conv";
import {GeneralService} from "../../../services/general.service";
import {ContratosService} from "../../../services/contratos.service";

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
  contract_id: number;
  public txtConv = TxtConv;
  public dateConv = DateConv;
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
  fileImg: File;
  fileImgUrl: string;
  public imgDatasTranfer: ImgDataTranferI[] = [];
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
    public contratosServ: ContratosService
  ) { }

  ngOnInit() {
    this.validYears = this.getYears();
    //this.initGeneralForm();

  }

  ionViewWillEnter() {
    console.log('view enter');
    this.initGeneralForm();

  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initReviewCanva();
    }, 1000);
  }

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

    this.gf.renta_of_codigo.disable();
    this.gf.retorno_of_codigo.disable();
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
  processDataImage(event: {imgUrl: string, image: File}) {
    this.fileImg = event.image;
    this.fileImgUrl = event.imgUrl;

    this.imgDatasTranfer.push({
      file: event.image,
      url: event.imgUrl,
      uploading: false
    });
  }

  uploadArrayDatasImg() {
    if (this.imgDatasTranfer.length === 0) {
      this.sweetMsgServ.printStatus('Debe adjuntar una imagen', 'warning');
      return;
    }

    this.sweetMsgServ.printStatus('Función en desarrollo', 'warning');
    return;

    /*this.sweetMsgServ.confirmRequest().then(async (data) => {
      if (data.value) {

        console.log('here');
        let _lastServError = null;
        for (let i = 0; i< this.bodyImgData.length; i++) {
          console.log('sending info---->');
          const formData = new FormData();
          formData.append('image', this.bodyImgData[i].file, this.bodyImgData[i].file.name);
          this.bodyImgData[i].uploading = true;

          let res = await this.bodyServ.uploadBodyPost(formData);

          if (res.ok === true) {
            this.bodyImgData[i].uploadOk = true;
            this.bodyImgData[i].uploading = false;
          } else {
            this.bodyImgData[i].uploadOk = false;
            this.bodyImgData[i].uploading = false;

            _lastServError = res.data.error.errors;
          }
        }

        let successTotal = 0;
        for (let j = 0; j < this.bodyImgData.length; j++) {
          if (this.bodyImgData[j].uploadOk === true) {
            successTotal ++;
          }
        }
        if (successTotal === this.bodyImgData.length) {
          console.log('all saved');
          this.sweetMsgServ.printStatus('Se han guardado sus imagenes de manera correcta', 'success');
          this.resetAll();
          this.navigate.navigateRoot(['/mi-historia']);
        } else {
          console.log('error', _lastServError);
          if (_lastServError) {
            this.sweetMsgServ.printStatusArray(_lastServError, 'error');
            setTimeout(() => {
              this.resetAll();
              this.navigate.navigateRoot(['/mi-historia']);
            }, 2000);
          } else {
            this.sweetMsgServ.printStatus('Se produjo un error al guardar una de sus imagenes, intentelo nuevamente o eliminela de la cola', 'error');
          }
        }
      }
    });*/
  }

  removeImg(index) {
    this.imgDatasTranfer.splice(index, 1);
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
      }
      //this.loadClienteData();
    }
  }
  //#endregion

  saveProcess(section: 'general-data') {
    //this.sweetMsgServ.printStatus('Acción en desarrollo', 'warning');
    console.log('section', section);
    let _payload;
    switch (section) {
      case 'general-data':
        this.gf.renta_of_codigo.enable();
        this.gf.retorno_of_codigo.enable();
        _payload = this.generalDataForm.value;
        console.log('generalData --->', _payload);

        this.gf.renta_of_codigo.disable();
        this.gf.retorno_of_codigo.disable();

        this.contratosServ.saveProgress(_payload).subscribe(res => {
          if (res.ok) {
            this.sweetMsgServ.printStatus(res.message, 'success');
            this.contract_id = res.id;
            this.num_contrato = res.contract_number;
          }
        })
        break;
    }
  }

  resetAll() {
    this.fileImg =  null;
    this.fileImgUrl =  null;
    this.imgDatasTranfer = [];
  }

}

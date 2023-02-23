import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HotelesService} from "../../../../../services/hoteles.service";
import {HotelesI} from "../../../../../interfaces/hoteles/hoteles.interface";
import {GeneralService} from "../../../../../services/general.service";
import {SweetMessagesService} from "../../../../../services/sweet-messages.service";
import {ToastMessageService} from "../../../../../services/toast-message.service";
import {ComisionistasI} from "../../../../../interfaces/comisionistas/comisionistas.interface";
import {ComisionistaFormComponent} from "../../../comisionistas/comisionista-form/comisionista-form.component";
import {TarifaHotelesI} from '../../../../../interfaces/tarifas/tarifa-hoteles.interface';
import {ClasesVehiculosI} from '../../../../../interfaces/catalogo-vehiculos/clases-vehiculos.interface';
import {ClasesVehiculosService} from '../../../../../services/clases-vehiculos.service';
import {TipoExternoI} from '../../../../../interfaces/hoteles/tipo-externo.interface';
import {TiposExternosService} from '../../../../../services/tipos-externos.service';

@Component({
  selector: 'app-hotel-form',
  templateUrl: './hotel-form.component.html',
  styleUrls: ['./hotel-form.component.scss'],
})
export class HotelFormComponent implements OnInit {
  @Input() asModal: boolean;
  @Input() hotel_id: number;
  public title: string;
  public hotelForm: FormGroup;
  public hotelData: HotelesI;

  public tipoExternos: TipoExternoI[] = []

  public tarifasHotelPayload: TarifaHotelesI[];
  public clasesVehiculos: ClasesVehiculosI[];

  constructor(
    public modalCtrl: ModalController,
    private fb: FormBuilder,
    private hotelesService: HotelesService,
    private generalServ: GeneralService,
    private sweetMsg: SweetMessagesService,
    private toastServ: ToastMessageService,
    private tipoExternoServ: TiposExternosService,
    public modalCtr: ModalController,
    public claseVehiculosServ: ClasesVehiculosService
  ) {
    this.title = 'Formulario Externos';
    this.hotelForm = this.fb.group({
      id: [null],
      nombre: [null, Validators.required],
      rfc: [null, Validators.required],
      direccion: [null, Validators.required],
      tel_contacto: [null, Validators.required],
      activo: [null],
      paga_cupon: [null],
      activar_descuentos: [null],
      acceso_externo: [null],
      tipo_id: [null]
    });
  }

  get ef() {
    return this.hotelForm.controls;
  }

  async ngOnInit() {
    this.loadTipoExternos();
    await this.loadClasesVehiculos();
    if (this.hotel_id) {
      this.loadHotelesData();
    } else {
      this.initHotelForm();
      this.initTarifaHotelPayload();
    }
  }

  initHotelForm(data?) {
    this.hotelForm.setValue({
      id: (data && data.id) ? data.id : null,
      nombre: (data && data.nombre) ? data.nombre : null,
      rfc: (data && data.rfc) ? data.rfc : null,
      direccion: (data && data.direccion) ? data.direccion : null,
      tel_contacto: (data && data.tel_contacto) ? data.tel_contacto : null,
      activo: (data && data.activo) ? data.activo : 0,
      paga_cupon: (data && data.paga_cupon) ? data.paga_cupon : 0,
      activar_descuentos: (data && data.activar_descuentos) ? data.activar_descuentos : 0,
      acceso_externo: (data && data.acceso_externo) ? data.acceso_externo : 0,
      tipo_id: (data && data.tipo_id) ? data.tipo_id : null,
    });
    this.hotelForm.controls.activo.disable();
  }

  initTarifaHotelPayload(data?) {
    if (data) {
      this.tarifasHotelPayload = null;
      this.tarifasHotelPayload = data;
      return;
    }
    this.tarifasHotelPayload = [];
    for (let i = 0; i < this.clasesVehiculos.length; i++) {
      this.tarifasHotelPayload.push({
        hotel_id: this.hotel_id,
        activo: true,
        clase_id: this.clasesVehiculos[i].id,
        clase: this.clasesVehiculos[i].clase,
        precio_renta: null,
        id: null,
        errors: []
      });
    }
  }

  loadHotelesData() {
    this.generalServ.presentLoading();
    this.hotelesService.getDataById(this.hotel_id).subscribe(res => {
      this.generalServ.dismissLoading();
      if (res.ok === true) {
        this.hotelData = res.hotel;
        this.initHotelForm(res.hotel);
        let _tarifas = res.hotel.tarifas;
        if (_tarifas && _tarifas.length > 0) {
          this.initTarifaHotelPayload(_tarifas);
        } else {
          this.initTarifaHotelPayload();
        }
      }
    }, error => {
      this.generalServ.dismissLoading();
      console.log(error);
    });
  }

  async loadClasesVehiculos() {
    let res = await this.claseVehiculosServ._getActive();
    console.log(res);
    if (res.ok) {
      this.clasesVehiculos = res.datas;
    }
  }

  loadTipoExternos() {
    this.tipoExternoServ.getActive().subscribe(res => {
      if (res.ok) {
        this.tipoExternos = res.data;
      }
    }, error => {
      console.log(error)
    })
  }

  captureFinalPrice(tarifaHotel: TarifaHotelesI, event) {
    tarifaHotel.precio_renta =  event.replace(/[$,]/g, "");
    this.reviewTarifaCapture();
  }

  reviewTarifaCapture(): boolean {
    let _haveErrors;
    if (this.tarifasHotelPayload && this.tarifasHotelPayload.length > 0) {
      for (let i = 0; i < this.tarifasHotelPayload.length; i++) {
        if (!this.tarifasHotelPayload[i].precio_renta || this.tarifasHotelPayload[i].precio_renta == 0) {
          if (!this.tarifasHotelPayload[i].errors.find(x => x === 'Debe indicar un precio valído')) {
            this.tarifasHotelPayload[i].errors.push('Debe indicar un precio valído');
          }
        } else {
          this.tarifasHotelPayload[i].errors = [];
        }
        if (this.tarifasHotelPayload[i].errors.length > 0) {
          _haveErrors = true;
        }
      }
      return _haveErrors !== true;
    }
  }

  saveUpdate() {
    if (this.hotelForm.invalid) {
      this.sweetMsg.printStatus('Debe llenar los campos requeridos', 'warning');
      this.hotelForm.markAllAsTouched();
      return;
    }
    if (this.reviewTarifaCapture() === false) {
      this.sweetMsg.printStatus('Se encontro información por verificar, revise las leyendas marcadas en rojo', 'warning');
      return;
    }

    this.generalServ.presentLoading('Guardando cambios ...');
    let _payload = this.hotelForm.value;
    _payload.tarifas_hotel = this.tarifasHotelPayload;

    console.log('hotel payload --->', _payload);

    this.hotelesService.saveUpdate(_payload, this.hotel_id).subscribe(res => {
      this.generalServ.dismissLoading();
      this.dismiss(true);
      if (res.ok === true) {
        this.toastServ.presentToast('success', res.message, 'top');
      }
    }, error => {
      console.log(error);
      this.generalServ.dismissLoading();
      this.sweetMsg.printStatusArray(error.error.errors, 'error')
    });
  }

  dismiss(reload?) {
    this.modalCtrl.dismiss({
      reload
    });
  }

  viewFrequencyDiscount(tHotel: TarifaHotelesI, view: boolean) {
    tHotel.view_frequency = view
  }

  /**
   * @deprecated
   * */
  async openComisionistaForm(_data?: ComisionistasI) {
    const pageEl: HTMLElement = document.querySelector('.ion-page');
    //this.generalService.presentLoading();
    const modal = await this.modalCtr.create({
      component: ComisionistaFormComponent,
      componentProps: {
        'asModal': true,
        'comisionista_id': (_data && _data.id) ? _data.id : null,
        'empresa_id': this.hotel_id,
        'loadLoading': false
      },
      swipeToClose: true,
      cssClass: 'edit-form',
      presentingElement: pageEl
    });
    await modal.present();
    const {data} = await modal.onWillDismiss();
    if (data.reload && data.reload === true) {
      this.loadHotelesData();
    }
  }
}

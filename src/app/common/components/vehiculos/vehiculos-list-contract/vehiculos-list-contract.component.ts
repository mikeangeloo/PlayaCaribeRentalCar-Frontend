import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {GeneralService} from "../../../../services/general.service";
import {ActionSheetController, ModalController, NavController} from "@ionic/angular";
import {SweetMessagesService} from "../../../../services/sweet-messages.service";
import {ToastMessageService} from "../../../../services/toast-message.service";
import * as moment from "moment";
import {TxtConv} from "../../../../helpers/txt-conv";
import {VehiculosC, VehiculosI} from "../../../../interfaces/catalogo-vehiculos/vehiculos.interface";
import {VehiculosService} from "../../../../services/vehiculos.service";
import {VehiculoFormComponent} from "../vehiculo-form/vehiculo-form.component";
import {TarifasApolloConfFormComponent} from '../../configuracion/precios/tarifas-apollo-conf-form/tarifas-apollo-conf-form.component';
import { ContratosService } from 'src/app/services/contratos.service';
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';
import { ReservaI } from 'src/app/interfaces/reservas/reserva.interface';
import { ReservasFormComponent } from '../../reservas/reservas-form/reservas-form.component';
import { threadId } from 'worker_threads';
import {ContratosStatus, ContratosStatusE} from '../../../../enums/contratos-status.enum';
import {CobranzaTipoE} from '../../../../enums/cobranza-tipo.enum';
import { DateConv } from 'src/app/helpers/date-conv';

@Component({
  selector: 'app-vehiculos-list-contract',
  templateUrl: './vehiculos-list-contract.component.html',
  styleUrls: ['./vehiculos-list-contract.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class VehiculosListContractComponent implements OnInit {
  public spinner = false;
  public reservaData: ReservaI[] = [];
  public editReserva: ReservaI;
  public editVehiculo: VehiculosI;
  @Input() public vehiculos: VehiculosI[] = [];
  @Input() isModal: boolean;
  @Output() emitData = new EventEmitter();
  public vehiculoC = VehiculosC;
  displayedColumns: string[] = [
    'estatus',
    'codigo',
    'marca',
    'modelo',
    'modelo_ano',
    'categoria',
    'version',
    'placas',
    'tarifa_categoria',
    'acciones',
  ];
  listVehiculos: MatTableDataSource<any>;
  expandedElement: VehiculosI | null;
  public searchKey: string;
  @ViewChild(MatPaginator, {static: false}) paginator3: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  public statusC = ContratosStatus;
  public idioma: 'es' | 'en' = 'es';
  cobranzaExtraPor: string = 'dias | horas';
  horaExtraMax = 2;

  constructor(
    public generalService: GeneralService,
    public vehiculosServ: VehiculosService,
    public modalCtr: ModalController,
    public navigateCtrl: NavController,
    public actionSheetController: ActionSheetController,
    public sweetServ: SweetMessagesService,
    public toastServ: ToastMessageService,
    public contractServ: ContratosService,
    public ngxSpinner: NgxSpinnerService,
    public router: Router,
  ) {
    this.initVehiculo();
   }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    const vehiculosChange = changes.vehiculos;
    if (vehiculosChange.isFirstChange() === true || vehiculosChange.firstChange === false) {
      if (this.vehiculos) {
        this.loadVehiculosTable(this.vehiculos);
      } else {
        this.loadVehiculosTable();
      }
    }
  }

  initVehiculo() {
    const currDate = moment().format('YYYY-MM-DD');
    this.editVehiculo = {
      id: 0,
    };
  }

  async loadReservas() {
    console.log(this.vehiculos);
      let res = await this.contractServ.getReservas();
      if (res.ok) {
        this.reservaData = res.data
      } else {
        console.log('error loading reservas');
      }


      let reservaI: VehiculosI[] =  [{
        id: null,
        codigo: null,
        estatus: null,
        marca: null,
        modelo: null,
        modelo_ano: null,
        categoria: null,
        version: null,
        placas: null,
        precio_renta: null,
        contrato: null
      }];

      this.reservaData.forEach((reserva,index) => {

        reservaI[index].id = reserva.id,
        reservaI[index].codigo = reserva.num_contrato,
        reservaI[index].estatus = 'reservado',
        reservaI[index].marca = {
          id: 0,
          marca: '-'
        },
        reservaI[index].modelo = '-',
        reservaI[index].modelo_ano = '-',
        reservaI[index].categoria = {
          id: 0,
          categoria: '-'
        },
        reservaI[index].version = '-',
        reservaI[index].placas = '-',
        reservaI[index].tarifa_categoria = {
          id: 0,
          categoria: reserva.tarifa_modelo_label,
          precio_renta: Number(reserva.tarifa_modelo_precio)

        },
        reservaI[index].contrato = reserva

        reservaI.push({...reservaI[index]})

      });
      reservaI.pop();
      this.vehiculos.push(...reservaI)
      console.log(this.vehiculos)


  }

  async setDiasHorasRetraso(vehiculos: VehiculosI[]) {
    for (const vehiculo of vehiculos) {
      if(vehiculo.contrato != null) {
        this.cobranzaExtraPor = 'horas';
        let hora_actual = DateConv.transFormDate(moment.now(), 'time');
        let fecha_actual = DateConv.transFormDate(moment.now(), 'regular');

        let _fechaRetornoM = moment(moment(`${vehiculo.contrato.fecha_retorno} ${vehiculo.contrato.hora_retorno}`).format('YYYY-MM-DD HH:mm'));
        let _fechaActualM = moment(moment(`${fecha_actual} ${hora_actual}`));
        let _dateDiffM = moment.duration(_fechaActualM.diff(_fechaRetornoM));
        let extraFrecuency = _dateDiffM.asHours();

        if (extraFrecuency > this.horaExtraMax) {
          this.cobranzaExtraPor = 'dias';
          extraFrecuency = _dateDiffM.asDays();
        }

        extraFrecuency = parseInt(extraFrecuency.toFixed(0));

        vehiculo.contrato.tipo_vencido = this.cobranzaExtraPor
        vehiculo.contrato.horas_vencido = (this.cobranzaExtraPor == 'horas') ? extraFrecuency : 0
        vehiculo.contrato.dias_vencido = (this.cobranzaExtraPor == 'dias') ? extraFrecuency : 0


        console.log('_fechaRetornoM -->', _fechaRetornoM);
        console.log('_fechaActualM -->', _fechaActualM);
        console.log('cobranzaExtraPor --->', this.cobranzaExtraPor);
        console.log('extraFrecuency -->', extraFrecuency);

        console.log(vehiculo.contrato);

      }



    }

  }

  // Método para cargar datos de los campus
  async loadVehiculosTable(_data?: VehiculosI[]) {
    //this.listado-hoteles = null;
    this.listVehiculos = null;
    this.initVehiculo();
    this.spinner = true;

    if (_data) {
      this.vehiculos = _data;
      this.spinner = false;
      this.listVehiculos = new MatTableDataSource(_data);
      this.listVehiculos.sort = this.sort;
      this.listVehiculos.paginator = this.paginator3;
    } else {

      this.vehiculosServ.getAllWithContract().subscribe(async response => {
        if (response.ok === true) {
          this.spinner = false;
          this.vehiculos = response.vehiculos;
          await this.loadReservas();
          await this.setDiasHorasRetraso(this.vehiculos)

          this.listVehiculos = new MatTableDataSource(this.vehiculos);
          this.listVehiculos.sort = this.sort;
          this.listVehiculos.paginator = this.paginator3;

        }
      }, error => {
        this.spinner = false;
        console.log(error);
      });
    }
  }

  // Method to filter mat-table according to the value enter at input search filter
  applyFilter(event?) {
    const searchValue = event.target.value;
    this.listVehiculos.filter = TxtConv.txtCon(searchValue, 'lowercase');
    // this.listSurveys.filter = this.searchKey.trim().toLocaleLowerCase();
    // if (this.dataSource.paginator) {
    //   this.dataSource.paginator.firstPage();
    // }
  }

  // Method to clear input search filter
  onSearchClear() {
    this.searchKey = '';
    this.applyFilter();
  }

  // Método para editar
  async openVehiculoForm(_data?: VehiculosI) {
    if (_data) {
      this.editVehiculo = _data;
    } else {
      this.initVehiculo();
    }
    //this.generalService.presentLoading();
    const modal = await this.modalCtr.create({
      component: VehiculoFormComponent,
      componentProps: {
        'asModal': true,
        'vehiculo_id': (_data && _data.id) ? _data.id : null
      },
      swipeToClose: true,
      cssClass: 'edit-form'
    });
    await modal.present();
    const {data} = await modal.onWillDismiss();
    if (data.reload && data.reload === true) {
      this.loadVehiculosTable();
    }
  }

   // Método para editar
   async openReservaForm(_data?: ReservaI) {
    if (_data) {
      this.editReserva = _data;
    }
    //this.generalService.presentLoading();
    const modal = await this.modalCtr.create({
      component: ReservasFormComponent,
      componentProps: {
        'asModal': true,
        'reserva_id': (_data && _data.id) ? _data.id : null
      },
      swipeToClose: false,
      backdropDismiss: false,
      cssClass: 'edit-form'
    });
    await modal.present();
    const {data} = await modal.onWillDismiss();
    if (data.reload && data.reload === true) {
      this.loadVehiculosTable();
    }
  }

  /** @deprecated */
  async openTarifasApolloConfForm() {
    const modal = await this.modalCtr.create({
      component: TarifasApolloConfFormComponent,
      componentProps: {
        'asModal': true,
      },
      swipeToClose: true,
      cssClass: 'edit-form'
    });
    await modal.present();
    const {data} = await modal.onWillDismiss();
    if (data.reload && data.reload === true) {
      this.loadVehiculosTable();
    }
  }

  detectIOS(): boolean {
    return [
        'iPad Simulator',
        'iPhone Simulator',
        'iPod Simulator',
        'iPad',
        'iPhone',
        'iPod'
      ].includes(navigator.platform)
      // iPad on iOS 13 detection
      || (navigator.userAgent.includes('Mac') && 'ontouchend' in document);
  }


  nuevoContrato(vehicle_id?: number) {
    if (vehicle_id) {
      this.router.navigateByUrl('/contratos/nuevo/' + vehicle_id)
    } else {
      this.router.navigateByUrl('/contratos/nuevo')
    }

  }


  retornar(data) {
    this.router.navigateByUrl('/contratos/view/'+ data.contrato.num_contrato)

  }

  async reimprimir(data) {
    console.log(data)

    if (data.contrato.estatus === ContratosStatusE.RESERVA) {
      const {role} = await this.languageOpt();
      if (role === 'cancel') {
        return;
      }
    }

    this.ngxSpinner.show();
    this.contractServ.viewPDF(data.contrato.id, data.contrato.estatus, this.idioma).subscribe(res => {
      const url = URL.createObjectURL(res);
      this.ngxSpinner.hide();
      if (this.detectIOS() === true) {
        window.location.assign(url);
      } else {
        window.open(url, '_blank');
      }
    }, error => {
      this.ngxSpinner.hide();
      const fr = new FileReader();
      fr.addEventListener('loadend', (e: any) => {
        const errors = JSON.parse(e.srcElement.result);
        this.sweetServ.printStatusArray(errors.errors, 'error');
      });
      fr.readAsText(error.error);
    });
  }

  async reimprimirReserva(id) {
    const {role} = await this.languageOpt();
    if (role === 'cancel') {
      return;
    }
    this.ngxSpinner.show();
    this.contractServ.viewReservaPDF(id, this.idioma).subscribe(res => {
      const url = URL.createObjectURL(res);
      this.ngxSpinner.hide();
      if (this.detectIOS() === true) {
        window.location.assign(url);
      } else {
        window.open(url, '_blank');
      }
    }, error => {
      this.ngxSpinner.hide();
      const fr = new FileReader();
      fr.addEventListener('loadend', (e: any) => {
        const errors = JSON.parse(e.srcElement.result);
        this.sweetServ.printStatusArray(errors.errors, 'error');
      });
      fr.readAsText(error.error);
    });
  }

  private async languageOpt(): Promise<any> {
    const actionSheet = await this.actionSheetController.create({
      header: 'Opciones',
      cssClass: 'my-custom-class',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Español',
          icon: 'language-outline',
          handler: () => {
            this.idioma = 'es';
          },
        },
        {
          text: 'Ingles',
          icon: 'language-outline',
          handler: () => {
           this.idioma = 'en';
          },
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel',
          cssClass: 'action-sheet-cancel',
          handler: () => {
            console.log('Cancel clicked');
          },
        },
      ],
    });

    await actionSheet.present();

    return actionSheet.onDidDismiss();
  }

  cancelar(vehiculo) {
    console.log(vehiculo)
    let msg = 'contrato';
    if (vehiculo.contrato.num_contrato.substr(0, 2) === 'RS') {
      msg = 'reserva'
    }
    this.sweetServ.confirmRequest(`¿Estas seguro de querer cancelar este ${msg}?`).then((data) => {
      if (data.value) {
        console.log(data.value);
       this.contractServ.cancelContract(vehiculo.contrato.id).subscribe(res => {
         if (res.ok) {
           this.sweetServ.printStatus(res.message, 'success');
           this.contractServ.flushContractData();
           localStorage.removeItem(this.generalService.dragObjStorageKey);
           setTimeout(() => {
             window.location.reload();
           }, 1000);

         }
       }, error => {
         console.log(error);
         this.sweetServ.printStatusArray(error.error.errors, 'error');
       })
      }
    });
  }
}

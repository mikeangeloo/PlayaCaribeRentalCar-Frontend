import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnInit, QueryList,
  SimpleChanges,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {NgxMaterialTimepickerTheme} from 'ngx-material-timepicker';
import {Months} from '../../../interfaces/shared/months';
import * as moment from 'moment';
import {SweetMessagesService} from '../../../services/sweet-messages.service';
import {CardI} from '../../../interfaces/cards/card.interface';
import {TarjetaFormComponent} from '../../../common/components/tarjetas/tarjeta-form/tarjeta-form.component';
import {ActionSheetController, AlertController, ModalController} from '@ionic/angular';
import {MultiTableFilterComponent} from '../../../common/components/multi-table-filter/multi-table-filter.component';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DateConv} from '../../../helpers/date-conv';
import {SessionService} from '../../../services/session.service';
import {SucursalesI} from '../../../interfaces/sucursales.interface';
import {TxtConv} from '../../../helpers/txt-conv';
import {GeneralService} from '../../../services/general.service';
import {ContratosService} from '../../../services/contratos.service';
import {ContratoI} from '../../../interfaces/contratos/contrato.interface';
import {ContratosStatus, ContratosStatusE} from '../../../enums/contratos-status.enum';
import {FilesService} from '../../../services/files.service';
import {DocDataTransfer} from '../../../interfaces/shared/doc-data-tranfer.interface';
import {VehiculosI} from '../../../interfaces/catalogo-vehiculos/vehiculos.interface';
import {TiposTarifasI} from '../../../interfaces/configuracion/tipos-tarifas.interface';
import {TiposTarifasService} from '../../../services/tipos-tarifas.service';
import {TarifasExtrasI} from '../../../interfaces/configuracion/tarifas-extras.interface';
import {TarifasExtrasService} from '../../../services/tarifas-extras.service';
import {CobranzaCalcI} from '../../../interfaces/cobranza/cobranza-calc.interface';
import {HotelesI} from '../../../interfaces/hoteles/hoteles.interface';
import {HotelesService} from '../../../services/hoteles.service';
import {TarifaHotelesI} from '../../../interfaces/tarifas/tarifa-hoteles.interface';
import {ComisionistasI} from '../../../interfaces/comisionistas/comisionistas.interface';
import {ComisionistasService} from '../../../services/comisionistas.service';
import {ModelsEnum} from '../../../enums/models.enum';
import {ToastMessageService} from '../../../services/toast-message.service';
import {UbicacionesI} from '../../../interfaces/configuracion/ubicaciones.interface';
import {UbicacionesService} from '../../../services/ubicaciones.service';
import {from, lastValueFrom, map, Observable, startWith, take, takeUntil} from 'rxjs';
import {CobranzaProgI, CobranzaTipo} from '../../../interfaces/cobranza/cobranza-prog.interface';
import {CobranzaService} from '../../../services/cobranza.service';
import {TarifasCategoriasI} from '../../../interfaces/configuracion/tarifas-categorias.interface';
import {TarifasCategoriasService} from '../../../services/tarifas-categorias.service';
import {CobranzaTipoE} from '../../../enums/cobranza-tipo.enum';
import {InputModalComponent} from '../../../common/components/input-modal/input-modal.component';
import {DragObjProperties} from '../../../common/draggable-resizable/draggable-resizable.component';
import {ModelosDocsComponent} from '../../../common/components/modelos-docs/modelos-docs.component';
import {
  ModalDragElementDetailsComponent
} from '../../../common/components/modal-drag-element-details/modal-drag-element-details.component';
import {CheckListTypeEnum} from '../../../enums/check-list-type.enum';
import {NotasService} from '../../../services/notas.service';
import {CheckListService} from '../../../services/check-list.service';
import {SignatureCaptureComponent} from 'src/app/common/components/signature-capture/signature-capture.component';
import html2canvas from 'html2canvas';
import {CargosExtraI} from 'src/app/interfaces/configuracion/cargos-extras.interface';
import {CargosRetornoExtrasService} from 'src/app/services/cargos-retorno-extras.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {ActivatedRoute, Router} from '@angular/router';
import {VehiculosStatusE} from '../../../enums/vehiculos-status.enum';
import {
  CobroDepositoModalComponent
} from '../../../common/components/cobro-deposito-modal/cobro-deposito-modal.component';
import {CategoriaVehiculosService} from '../../../services/categoria-vehiculos.service';


@Component({
  selector: 'app-contrato',
  templateUrl: './contrato.page.html',
  styleUrls: ['./contrato.page.scss'],
})

export class ContratoPage implements OnInit, AfterViewInit {

  @Input() isReserva: boolean = false;
  @Input() idioma: 'es' | 'en' = 'es';

  @ViewChild(SignatureCaptureComponent) signatureComponent;

  public loading = false;
  public statusColor = "white";
  public contractTypePrefix: { type: string, prefix: string };
  //#region STEP CONTROLLER ATTRIBUTES
  step = 0;
  //#endregion

  //#region DATOS GENERALES ATTRIBUTES
  generalDataForm: FormGroup;
  userSucursal: SucursalesI; //todo: evaluar
  num_contrato: string;
  contractData: ContratoI;
  public txtConv = TxtConv;
  public dateConv = DateConv;
  public statusC = ContratosStatus;
  public ubicaciones: UbicacionesI[];
  public contract_id: number;
  exitPlacesOptions$: Observable<UbicacionesI[]>;
  returnPlacesOptions$: Observable<UbicacionesI[]>;
  tarifasCategorias: TarifasCategoriasI[];
  selectedTarifaCat: TarifasCategoriasI | TarifaHotelesI;
  //#endregion

  //#region DATOS CLIENTE ATTRIBUTES
  clienteDataForm: FormGroup;
  @ViewChild('docsClient', {static: false}) docsClientComponent: ModelosDocsComponent
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
  public _maxDate: any;
  public contractFechaSalida = DateConv.transFormDate(moment.now(), 'regular');
  public useCalendar = false;
  //#endregion

  //#region IMAGES MANAGEMENT ATTRIBUTES
  public clientes_docs: DocDataTransfer[] = [];
  public contratos_docs: DocDataTransfer[] = [];
  public cobranza_docs: DocDataTransfer[] = [];

  public docPayLoad: {
    doc_type: 'licencia_conducir' | 'cupon',
    model: 'clientes' | 'contratos' | 'cobranza',
    //model_id: 'cliente_id' | 'contrato_id' | 'cobranza_id'
  }
  //#endregion

  //#region COBRANZA ATTRIBUTES
  @ViewChildren('docsVoucherCobrosTarjetaSalida') docsVoucherCobrosTarjetaSalida: QueryList<ModelosDocsComponent>
  @ViewChildren('docsVoucherCobrosAuth') docsVoucherCobrosAuth: QueryList<ModelosDocsComponent>
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
  public tiposTarifas: TiposTarifasI[];
  public cobranzaI: CobranzaCalcI[] = [];

  public hoteles: HotelesI[];
  public tarifasHotel: TarifaHotelesI[];

  public comisionistas: ComisionistasI[];
  public comisiones: number[];

  public cobranzaProgData: CobranzaProgI[] = [];
  public balancePorPagar: number = 0.00;
  public cobranzaTipos = CobranzaTipoE;

  public pagadoTotal = 0;
  public pagadoAutTotal = 0;

  //#endregion

  //#region CHECKLIST ATTRIBUTES
  dragObjs: DragObjProperties[] = [];
  selectedDragObj: DragObjProperties;
  vehicleOutlineBackground: string;
  externalLayoutPresent: boolean;
  checkListForm: FormGroup;
  public check_list_img;
  //#endregion

  //#region SIGNATURE MANAGEMENT ATTRIBUTES
  public signature: any | string;
  public signature_matrix = '';
  public terminos=false;
  public freeFromDamages = false
  //#endregion

  //#region RETORNO ATTRIBUTES
  retornoDataForm: FormGroup;
  cargos_extras_toggle = false;
  frecuencia_extras_toggle = false;
  cargosExtras: CargosExtraI[];
  extraFrecuency: number;
  public cobranzaRetornoI: CobranzaCalcI[] = [];

  public cobranzaProgRetornoData: CobranzaProgI[] = [];
  public balanceRetornoPorPagar: number = 0.00;
  public pagadoRetornoTotal = 0;
  public pagadoRetornoAutTotal = 0;


  cobranzaExtraPor: string = 'dias | horas';
  horaExtraMax = 2;
  hora_actual: string;
  hora_retorno: string;

  fecha_actual: string;
  fecha_retorno: string;

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
    public tarifasExtrasServ: TarifasExtrasService,
    public cargosRetornoExtrasServ: CargosRetornoExtrasService,
    public hotelesServ: HotelesService,
    public comisionistasServ: ComisionistasService,
    public toastServ: ToastMessageService,
    public ubicacionesServ: UbicacionesService,
    public cobranzaServ: CobranzaService,
    public tarifasCatServ: TarifasCategoriasService,
    public categoriaVehiculoServ: CategoriaVehiculosService,
    public actionSheetController: ActionSheetController,
    public alertController: AlertController,
    public notasServ: NotasService,
    public checkListServ: CheckListService,
    public spinner: NgxSpinnerService,
    public router: Router,
    public route: ActivatedRoute,
    public modalCtrl: ModalController,

  ) { }

  async ngOnInit() {
    this.validYears = this.getYears();
    if (this.isReserva) {
      this.contratosServ.flushReservaData()
      this.contratosServ.flushContractData()
      await this.ionViewWillEnter();
    }
  }

  async ionViewWillEnter() {
    this.spinner.show();

    await this.loadTiposTarifas();
    await this.loadTarifasCat();
    this.loadTarifasExtras();
    await this.loadHoteles();
    await this.loadComisionistas();
    await this.loadUbicaciones();
    await this.loadCargosExtras();

    //TODO Validar si existe contrato en local y preguntar si quiere recuperar la info



    let contract_number = this.route.snapshot.paramMap.get('contract_number');

    if(contract_number) {
      this.contratosServ.setContractData(contract_number);
      await this.reloadAll();
    } else {
      // revisamos si hay contrato en localstorage
      if (this.contratosServ.getContractNumber()) {
        await this.sweetMsgServ.confirmRequest('Existe un contrato con el folio:' + this.contratosServ.getContractNumber() + ' guardado temporalmente', '¿Quieres reanudar tu avance?, si lo cancelas tu información se perdera', 'Continuar Editando', 'Nuevo Contrato').then(async (data) => {
          if (data.value) {
            await this.reloadAll();
          } else {
            let res = await this.contratosServ._getContractData(this.contratosServ.getContractNumber());
            if (res.ok === true) {
              if (res.data.estatus == ContratosStatusE.BORRADOR) {
                this.contratosServ.cancelContract(res.data.id).subscribe(async res => {
                  if (res.ok) {
                    this.sweetMsgServ.printStatus(res.message, 'success');
                    localStorage.removeItem(this.generalServ.dragObjStorageKey);
                    this.contratosServ.flushContractData();
                    await this.reloadAll();
                  }
                }, error => {
                  console.log(error);
                  this.sweetMsgServ.printStatusArray(error.error.errors, 'error');
                })
              } else {
                this.contratosServ.flushContractData();
                await this.reloadAll();
              }

            } else {
              this.contratosServ.flushContractData();
              await this.reloadAll();
            }
          }
        })
      } else {
        await this.reloadAll();
      }

    }

    //await this.reloadAll();



  }

  private _filterUbicacion(alias: string): UbicacionesI[] {
    const filterValue = alias.toLowerCase();
    return this.ubicaciones.filter(alias => alias.alias.toLowerCase().includes(filterValue));
  }

  displayUb(id) {
    if (!id) return '';
    let index = this.ubicaciones.findIndex(state => state.id === id);
    return this.ubicaciones[index].alias;
  }

  returnUbicacion(id) {
    return this.ubicaciones.find(x => x.id == id)?.alias;
  }

  async reloadAll() {
    //TODO: quitar al guardar en DB
    // if (localStorage.getItem(this.generalServ.dragObjStorageKey)) {
    //   let dragObjs = JSON.parse(localStorage.getItem(this.generalServ.dragObjStorageKey));
    //   if (dragObjs && dragObjs.length > 0) {
    //     for (let i = 0; i < dragObjs.length; i++) {
    //       dragObjs[i].enable = false;
    //       this.dragObjs = dragObjs;
    //     }
    //
    //   }
    // }

    // verificamos si tenemos guardado un contract_id en local storage para continuar con la edición

    if (this.contratosServ.getContractNumber()) {
      this.contractTypePrefix = this.contratosServ.getContractTypePrefix(this.contratosServ.getContractNumber());

      this.num_contrato = this.contratosServ.getContractNumber();

      let res = await this.contratosServ._getContractData(this.num_contrato);
        if (res.ok) {

          this.freeFromDamages = res.data.freeFromDamages;

          if (this.num_contrato !== res.data.num_contrato) {
            await this.router.navigate(['contratos/view'], res.data.num_contrato);
            return;
          }

          this.contractData = res.data;
          this.contract_id = this.contractData.id
          if (this.contractData.estatus == ContratosStatusE.BORRADOR || this.contractData.estatus === ContratosStatusE.RESERVA) {
            this.statusColor = "yellow";
          } else if (this.contractData.estatus == ContratosStatusE.RENTADO) {
            this.statusColor = "DeepSkyBlue";
          } else if (this.contractData.estatus == ContratosStatusE.CERRADO) {
            this.statusColor = "SpringGreen";
          }

          if (this.contractData.etapas_guardadas && this.contractData.etapas_guardadas.length > 0) {
            let _datosClienteEtapa = this.contractData.etapas_guardadas.find(x => x === 'datos_cliente');
            if (_datosClienteEtapa) {
              let _clientesPayload = this.contractData.cliente;
              this.initClientForm(_clientesPayload);
              //this.getDocs('licencia_conducir', 'clientes', _clientesPayload.id);
              this.step = 1;
            } else {
              this.initClientForm();
            }

            let _datosGeneralesEtapa = this.contractData.etapas_guardadas.find(x => x === 'datos_generales');
            if (_datosGeneralesEtapa) {
              this.initGeneralForm(this.contractData);
              //this.getDocs('cupon', 'contratos', this.contractData.id);
              this.step = 2;

            } else {
              this.initGeneralForm();
            }

            // Si tenemos vehiculoId pasado desde routing
            let vehiculoIdRouting = this.route.snapshot.paramMap.get('vehicle_id')
            let _datosVehiculo = this.contractData.etapas_guardadas.find(x => x === 'datos_vehiculo');

            if (_datosVehiculo) { // evaluamos de acuerdo a la etapa de guardada en contratos
              if (this.contractData.vehiculo || this.contractData.estatus === ContratosStatusE.RESERVA) {
                this.step = 3;
                this.vehiculoData = this.contractData.vehiculo;
                this.setVehiculoBackgroundLayout(this.vehiculoData.categoria_vehiculo_id, this.vehiculoData.categoria.categoria);
                this.initVehiculoForm(this.contractData);

              }

            } else if (vehiculoIdRouting) {
                let vehiculosPayload = {
                  vehicle_id: vehiculoIdRouting
                }
                this.generalServ.getList('vehiculos', vehiculosPayload).subscribe(res => {
                  if (res.ok) {
                    this.vehiculoData = res.fullData[0]
                    this.setVehiculoBackgroundLayout(this.vehiculoData.categoria_vehiculo_id, this.vehiculoData.categoria.categoria);
                    this.initVehiculoForm(this.vehiculoData);
                  }
                })
            } else {
              this.initVehiculoForm();
            }

            let _cobranzaData = this.contractData.etapas_guardadas.find(x => x === 'cobranza');
            if (_cobranzaData && (this.contractData.cobranza && this.contractData.cobranza.length > 0)) {
              this.cobranzaProgData = this.contractData.cobranza.filter(x => x.cobranza_seccion == 'salida' || x.cobranza_seccion == 'reserva');
              this.recalBalancePorCobrar();
              if (this.balancePorPagar <= 0 && this.pagadoAutTotal > 0) {
                this.step = 4;
              };


            } else {
              this.cobranzaProgData = [];
            }

            let _checkListSalidaData = this.contractData.etapas_guardadas.find(x => x === 'check_list_salida');
            if (_checkListSalidaData) {
              this.fetchDragObjsFromApi(this.contractData.check_list_salida)
            }

            let _checkFormListData = this.contractData.etapas_guardadas.find(x => x === 'check_form_list');
            if (_checkFormListData) {

              if (this.contractData.check_form_list) {
                this.step = 5;
                this.initCheckListForm(this.contractData.check_form_list);

              }

            } else {
              this.initCheckListForm()
            }
            let _firma = this.contractData.etapas_guardadas.find(x => x === 'firma');
            if (_firma) {
              this.terminos = true;
              this.signature_matrix = this.contractData.firma_matrix;
              this.signature = {
                signature_matrix: JSON.parse(this.contractData.firma_matrix),
                signature_img: this.contractData.firma_cliente
              }
              this.step = 6;
            }
            let _retorno = this.contractData.etapas_guardadas.find(x => x === 'retorno');
            if (_retorno) {
              this.step = 7;
              this.initRetornoForm(this.contractData);
              if(this.contractData.cargos_retorno_extras){
                this.cargos_extras_toggle = true;
              }
              if (this.contractData.frecuencia_extra) {
                this.frecuencia_extras_toggle = true;
              }



            }else {
              this.initRetornoForm(this.contractData);
            }


            let _cobranzaRetornoData = this.contractData.etapas_guardadas.find(x => x === 'cobranza_retorno');
            if (_cobranzaRetornoData && (this.contractData.cobranza && this.contractData.cobranza.length > 0)) {
              this.cobranzaProgRetornoData = this.contractData.cobranza.filter(x => x.cobranza_seccion == 'retorno' );
            } else {
              this.cobranzaProgRetornoData = [];
            }

            if(this.contractData.estatus == ContratosStatusE.RESERVA && !_datosVehiculo && !this.isReserva) {
              this.step = 2;
            }


          }
          if (this.generalDataForm.controls.total.value) {

            this.recalBalancePorCobrar();
          }
          if (this.retornoDataForm.controls.total_retorno.value) {
            this.recalBalanceRetornoPorCobrar();
          }
          this.spinner.hide();
        } else {
          console.log(res.errors);
          this.sweetMsgServ.printStatusArray(res.errors.error.errors, 'error');
          this.contratosServ.flushContractData();
          this.router.navigateByUrl('/contratos/nuevo')
          this.spinner.hide();
        }
    } else {
      this.initGeneralForm();
      this.initClientForm();
      this.initVehiculoForm();
      this.initCheckListForm();
      this.initRetornoForm();
      this.cobranzaProgRetornoData = [];
      this.cobranzaProgData = [];
      this.spinner.hide();
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

  //#region GENERAL FORM FUNCTIONS
  initGeneralForm(data?: ContratoI) {
    let _todayHour = DateConv.transFormDate(moment.now(), 'time');
    let _tipoTarifaApollo = this.tiposTarifas.find(x => TxtConv.txtCon(x.tarifa, 'uppercase') === 'APOLLO');
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
      tipo_tarifa_id: [(data && data.tipo_tarifa_id) ? data.tipo_tarifa_id : (_tipoTarifaApollo && _tipoTarifaApollo.id ? _tipoTarifaApollo.id : null), Validators.required],
      tipo_tarifa: [(data && data.tipo_tarifa) ? data.tipo_tarifa : (_tipoTarifaApollo && _tipoTarifaApollo.tarifa ? _tipoTarifaApollo.tarifa : null), Validators.required],

      modelo_id: [(data && data.modelo_id) ? data.modelo_id : null],
      modelo: [(data && data.modelo) ? data.modelo : null],

      tarifa_modelo: [(data && data.tarifa_modelo ? data.tarifa_modelo: null), Validators.required],
      tarifa_modelo_id: [(data && data.tarifa_modelo_id ? data.tarifa_modelo_id : null), Validators.required],
      tarifa_apollo_id: [(data && data.tarifa_apollo_id ? data.tarifa_apollo_id : null)],
      tarifa_modelo_label: [(data && data.tarifa_modelo_label ? data.tarifa_modelo_label: null)],
      tarifa_modelo_precio: [(data && data.tarifa_modelo_precio ? data.tarifa_modelo_precio: null), Validators.required],
      tarifa_modelo_obj: [(data && data.tarifa_modelo_obj ? data.tarifa_modelo_obj: null), Validators.required],

      vehiculo_clase_id: [(data && data.vehiculo_clase_id) ? data.vehiculo_clase_id : null],
      vehiculo_clase: [(data && data.vehiculo_clase) ? data.vehiculo_clase : null],
      vehiculo_clase_precio: [(data && data.vehiculo_clase_precio) ? data.vehiculo_clase_precio : null],


      precio_unitario_inicial: [(data && data.precio_unitario_inicial ? data.precio_unitario_inicial : null)],
      comision: [(data && data.comision) ? data.comision : null],
      precio_unitario_final: [(data && data.precio_unitario_final) ? data.precio_unitario_final : null],

      rango_fechas: this.fb.group({
        fecha_salida: [(data && data.fecha_salida ? data.fecha_salida : this._today), Validators.required],
        fecha_retorno: [(data && data.fecha_retorno ? data.fecha_retorno : null), Validators.required],
      }),

      cobros_extras_ids: [(data && data.cobros_extras_ids ? data.cobros_extras_ids : null)],
      cobros_extras: [(data && data.cobros_extras ? data.cobros_extras : null)],
      subtotal: [(data && data.subtotal ? data.subtotal : null), Validators.required],
      con_descuento: [(data && data.con_descuento ? data.con_descuento: null)],
      descuento: [(data && data.descuento ? data.descuento : null)],
      con_iva: [(data && data.con_iva ? data.con_iva : null)],
      iva: [(data && data.iva ? data.iva : null)],
      iva_monto: [(data && data.iva_monto ? data.iva_monto : null)],
      total: [(data && data.total ? data.total : null), Validators.required],

      folio_cupon: [(data && data.folio_cupon ? data.folio_cupon : null)],
      valor_cupon: [(data && data.valor_cupon ? data.valor_cupon : null)],

      cobranza_calc: [(data && data.cobranza_calc ? data.cobranza_calc : null), Validators.required],

      total_dias: [(data && data.total_dias) ? data.total_dias : null, Validators.required],
      ub_salida_id: [(data && data.ub_salida_id) ? data.ub_salida_id : null, Validators.required],
      ub_retorno_id: [(data && data.ub_retorno_id) ? data.ub_retorno_id : null, Validators.required],
    });

    if (data && data.id) {
      this.contract_id = data.id;
    }

    if (data && data.tarifa_modelo_id && TxtConv.txtCon(data.tipo_tarifa, 'uppercase') !== 'HOTEL') {
      let tarifaCat: TarifasCategoriasI = this.tarifasCategorias.find(x => x.id === this.gf.tarifa_modelo_id.value);
      if (!tarifaCat.tarifas_apollo || tarifaCat.tarifas_apollo.length === 0) {
        this.sweetMsgServ.printStatus('Esta opción no aplica para descuento', 'warning');
      }
      this.selectedTarifaCat = tarifaCat;
    }

    if (data && data.fecha_salida) {
      this._today = data.fecha_salida;
      this.contractFechaSalida = data.fecha_salida;
      this._maxDate = DateConv.transFormDate(this._today, 'moment').add(30, 'days');
    }

    if (data && data.cobranza_calc && data.cobranza_calc.length) {
      this.cobranzaI = data.cobranza_calc;
    }
    if (data && data.modelo == ModelsEnum.HOTELES && data.vehiculo_clase_id) {
      this.loadHotelTarifas(false);
    }

    if (data && data.modelo == ModelsEnum.COMISIONISTAS && data.comision) {
      this.setComisiones(false);
    }

    if (data && (data.con_descuento == true || data.con_descuento == 1)) {
      this.generalDataForm.controls.con_descuento.enable();
    } else {
      this.generalDataForm.controls.con_descuento.disable();
    }

    if (data && data.total_dias) {
      this.setBaseRentFrequency();
    }

    this.exitPlacesOptions$ = this.generalDataForm.controls.ub_salida_id.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value: value.alias)),
      map(alias => (alias ? this._filterUbicacion(alias): this.ubicaciones.slice())),
    );

    this.returnPlacesOptions$ = this.generalDataForm.controls.ub_retorno_id.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value: value.alias)),
      map(alias => (alias ? this._filterUbicacion(alias): this.ubicaciones.slice())),
    );

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

  async loadTiposTarifas() {
    let res = await this.tiposTarifasServ._getActive();
    if (res.ok) {
      this.tiposTarifas = res.data;
    } else {
      console.log('error loadTiposTarifas --->', res);
    }
  }

  async loadTarifasCat() {
    let res = await this.tarifasCatServ._getActive();
    if (res.ok) {
      this.tarifasCategorias = res.data;
    } else {
      console.log('error loadTarifasCat --->', res);
    }
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

  async loadCargosExtras() {
    let res = await this.cargosRetornoExtrasServ.getActive();
    if (res.ok) {
      this.cargosExtras = res.data;
    } else {
      console.log('error loadCargos extras err --->', res);
    }
  }

  get gf() {
    return this.generalDataForm.controls;
  }
  get rangoFechas() {
    return this.gf.rango_fechas['controls'];
  }
  get rangoFechasGroup() {
    return this.generalDataForm.get('rango_fechas') as FormGroup;
  }

  setBaseRentFrequency() {
    let _totalDias = this.gf.total_dias.value;
    if (!_totalDias) {
      this.gf.total_dias.markAllAsTouched();
      return;
    }
    if (_totalDias < 7) {
      this.baseRentFrequency = 'days';
      this.gf.con_descuento.patchValue(null);
      this.gf.con_descuento.disable();
    } else if (_totalDias >= 7 && _totalDias < 30) {
      this.baseRentFrequency = 'weeks';
    } else if (_totalDias >= 30) {
      this.baseRentFrequency = 'months';
    }
    this.enableDisableDescuentoFreq(true);

  }

  setVehiculoBackgroundLayout(categoriaVehiculoId: number, categoria: string) {
    this.categoriaVehiculoServ.getDataById(categoriaVehiculoId).subscribe(res => {
      if (res.ok) {
        if (res.layout?.file) {
          this.vehicleOutlineBackground = res.layout?.file;
          this.externalLayoutPresent = true;
        } else {
          this.vehicleOutlineBackground = categoria.toLowerCase();
          this.externalLayoutPresent = false;
        }
      }
    }, error => {
      console.log(error);
      this.vehicleOutlineBackground = categoria.toLowerCase();
      this.externalLayoutPresent = false;
    })
  }
  //#endregion

  //#region CLIENT FORM FUNCTIONS
  initClientForm(data?) {
    this.clienteDataForm = this.fb.group({
      cliente_id: [(data && data.id ? data.id : null)],
      nombre: [(data && data.nombre ? data.nombre: null), Validators.required],
      //apellidos: [(data && data.apellidos ? data.apellidos: null), Validators.required],
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

  //#region RETORNO FORM FUNCTIONS
  initRetornoForm(data?) {
    this.retornoDataForm = this.fb.group({
      cant_combustible_retorno: [(data && data.cant_combustible_retorno ? data.cant_combustible_retorno : null), Validators.required],
      km_final: [(data && data.km_final ? data.km_final: null), [Validators.required, Validators.min(this.vehiculoForm?.controls.km_inicial.value)]],
      cargos_extras_retorno_ids: [(data && data.cargos_retorno_extras_ids ? data.cargos_retorno_extras_ids : null)],
      cargos_extras_retorno: [(data && data.cargos_retorno_extras ? data.cargos_retorno_extras : null)],
      frecuencia_extra: [(data && data.frecuencia_extra ? data.frecuencia_extra : null)],
      cobranzaExtraPor: [(data && data.cobranzaExtraPor) ? data.cobranzaExtraPor : null],
      subtotal_retorno: [(data && data.subtotal_retorno ? data.subtotal_retorno : null), Validators.required],
      con_iva_retorno: [(data && data.con_iva_retorno ? data.con_iva_retorno : null)],
      iva_retorno: [(data && data.iva_retorno ? data.iva_retorno : null)],
      iva_monto_retorno: [(data && data.iva_monto_retorno ? data.iva_monto_retorno : null)],
      total_retorno: [(data && data.total_retorno ? data.total_retorno : null), Validators.required],
      cobranza_calc_retorno: [(data && data.cobranza_calc_retorno ? data.cobranza_calc_retorno : null), Validators.required],
    });

    if (data && data.cobranza_calc && data.cobranza_calc.length) {
      this.cobranzaRetornoI = data.cobranza_calc_retorno;
    }

    if (data && data.hora_retorno) {
      this.hora_retorno = data.hora_retorno;
      this.fecha_retorno = data.fecha_retorno;

      this.checkExtraChargeFrecuency();

    }
  }

  get rf() {
    return this.retornoDataForm.controls;
  }

  checkExtraChargeFrecuency() {
    this.cobranzaExtraPor = 'horas';
    this.hora_actual = DateConv.transFormDate(moment.now(), 'time');
    this.fecha_actual = DateConv.transFormDate(moment.now(), 'regular');

    let _fechaRetornoM = moment(moment(`${this.fecha_retorno} ${this.hora_retorno}`).format('YYYY-MM-DD HH:mm'));
    let _fechaActualM = moment(moment(`${this.fecha_actual} ${this.hora_actual}`));
    let _dateDiffM = moment.duration(_fechaActualM.diff(_fechaRetornoM));
    this.extraFrecuency = _dateDiffM.asHours();

    if (this.extraFrecuency > this.horaExtraMax) {
      this.cobranzaExtraPor = 'dias';
      this.extraFrecuency = _dateDiffM.asDays();
    }

    this.extraFrecuency = parseInt(this.extraFrecuency.toFixed(0));

    if (this.retornoDataForm.controls.frecuencia_extra.value != null && this.retornoDataForm.controls.frecuencia_extra.value < this.extraFrecuency) {
      return;
    }
    this.retornoDataForm.controls.frecuencia_extra.patchValue(this.extraFrecuency);


  }

  //#endregion

  //#region CHECKLIST FORM FUNCTIONS
  initCheckListForm(data?) {
    this.checkListForm = this.fb.group({
      check_form_list_id: [(data && data.id ? data.id : null)],
      tarjeta_circulacion: [(data && data.tarjeta_circulacion ? data.tarjeta_circulacion : null), Validators.required],
      tapetes: [(data && data.tapetes ? data.tapetes: null),Validators.required],
      //silla_bebes: [(data && data.silla_bebes ? data.silla_bebes: null), ],
      espejos: [(data && data.espejos ? data.espejos: null), Validators.required],
      tapones_rueda: [(data && data.tapones_rueda ? data.tapones_rueda: null), Validators.required],
      tapon_gas: [(data && data.tapon_gas ? data.tapon_gas: null), Validators.required],
      senalamientos: [(data && data.senalamientos ? data.senalamientos: null), Validators.required],
      gato: [(data && data.gato ? data.gato: null), Validators.required],
      llave_rueda: [(data && data.llave_rueda ? data.llave_rueda: null), Validators.required],
      limpiadores: [(data && data.limpiadores ? data.limpiadores: null), Validators.required],
      antena: [(data && data.antena ? data.antena: null), Validators.required],
      navegador: [(data && data.navegador ? data.navegador: null), Validators.required],
      placas: [(data && data.placas ? data.placas: null), Validators.required],
      radio: [(data && data.radio ? data.radio: null), Validators.required],
      llantas: [(data && data.llantas ? data.llantas: null), Validators.required],
      observaciones: [(data && data.observaciones ? data.observaciones: null)],
    });
  }

  get checkListf() {
    return this.checkListForm.controls;
  }

  //#endregion

  //#region VEHICULO FORM FUNCTIONS
  initVehiculoForm(data?) {
    this.vehiculoForm = this.fb.group({
      vehiculo_id: [(data && data.id ? data.id : null), Validators.required],
      km_anterior: [(data && data.km_anterior ? data.km_anterior : (data && data.km_recorridos) ? data.km_recorridos : null), Validators.required],
      km_inicial: [(data && data.km_inicial ? data.km_inicial : null), [Validators.required]],
      km_final: [(data && data.km_final ? data.km_final : null)],
      cant_combustible_anterior: [(data && data.cant_combustible_anterior ? data.cant_combustible_anterior : null)],
      cant_combustible_salida: [(data && data.cant_combustible_salida ? data.cant_combustible_salida : null), Validators.required],
      cant_combustible_retorno: [(data && data.cant_combustible_retorno ? data.cant_combustible_retorno : null)],
    });

    this.vehiculoForm.controls.km_inicial.setValidators([Validators.min(this.vehiculoForm?.controls.km_anterior.value)])
    this.checkVehiculoFormDisableFields();
  }

  get vf() {
    return this.vehiculoForm.controls;
  }

  showRetornoExtras() {
    if (this.cargos_extras_toggle === false) {
      this.rf.cargos_extras_retorno_ids.patchValue(null);
      this.rf.cargos_extras_retorno.patchValue(null);
      this.cobranzaRetornoI = [];
      return;
    }
    //this.makeCalcRetorno();
    //this.cargos_extras_toggle = !this.cargos_extras_toggle
  }



  checkVehiculoFormDisableFields() {
    if (this.vehiculoData && this.vehiculoData.km_recorridos) {
      this.vehiculoForm.controls.km_anterior.patchValue(this.vehiculoData.km_recorridos);
    }

    if (this.vehiculoData && this.vehiculoData.cant_combustible_anterior) {
      this.vehiculoForm.controls.cant_combustible_anterior.patchValue(this.vehiculoData.cant_combustible_anterior);
    }

    this.vehiculoForm.controls.cant_combustible_anterior.disable();
    this.vehiculoForm.controls.km_anterior.disable();

    if (this.contractData && this.contractData.estatus) {
      switch (this.contractData.estatus) {
        case ContratosStatusE.ELIMINADO:
        case ContratosStatusE.CERRADO:
          this.vehiculoForm.disable();
          break;
        case ContratosStatusE.BORRADOR:
        case ContratosStatusE.RENTADO:
          this.vehiculoForm.controls.km_final.disable();
          this.vehiculoForm.controls.cant_combustible_retorno.disable();
          break;
      }
    }
  }

  convertFractionToLiters(fraction): number {
    let _capTanque = parseInt(this.vehiculoData.cap_tanque);
    let frac = eval(fraction);
    let _fraccionDecimal = parseFloat(parseFloat(frac).toPrecision(2));
    let _litros = _fraccionDecimal * _capTanque;
    return _litros;
  }

  faltanLitros(): boolean {
    if (!this.vf.cant_combustible_salida.value || !this.rf.cant_combustible_retorno.value) {
      return null;
    }
    let _litrosSalida = this.convertFractionToLiters(this.vf.cant_combustible_salida.value);
    let _litrosRetorno = this.convertFractionToLiters(this.rf.cant_combustible_retorno.value);
    return _litrosRetorno < _litrosSalida;
  }
  //#endregion

  //#region HOTELES FUNCTIONS
  async loadHoteles() {
    let res = await this.hotelesServ.getActive();
    if (res.ok) {
      this.hoteles = res.hoteles;
    } else {
      this.sweetMsgServ.printStatus('No hay hoteles dados de alta', 'warning');
      return;
    }
  }
  //#endregion

  //#region COMISIONISTAS FUNCTIONS

  async loadComisionistas() {
    let res = await this.comisionistasServ._getActive();
    if (res.ok) {
      this.comisionistas = res.data;
    } else {
      this.sweetMsgServ.printStatus('No hay comisionistas dados de alta', 'warning');
      return;
    }
  }
  //#endregion

  //#region UBICACIONES FUNCIONTS
  async loadUbicaciones() {
    let res = await this.ubicacionesServ._getActive();
    if (res.ok) {
      this.ubicaciones = res.data
    } else {
      console.log('error loading ubicacioens');
    }
  }
  //#endregion

  //#region REVIEW MANAGEMENT FUNCTIONS
  initReviewCanva() {
    return;
    // @ts-ignore
    let canvas: HTMLCanvasElement = document.getElementById('revisionC');
    let ctx = canvas.getContext("2d");

    let _width = document.getElementById('revisionRowW').offsetWidth;
    let _fixHeight = 200;
    if (window.innerWidth <= 768) {
      _fixHeight = 500;
    }
    let _height = document.body.offsetHeight - _fixHeight;

    canvas.width = _width;
    //canvas.height = 800;


    var background = new Image();
    background.src = 'assets/img/svg/sedan.svg';

    background.onload = function(){
      ctx.drawImage(background,0,0);
    }
  }

  async freeOffDamages(indicatorIcon, indicatorTitle) {

    if (!this.freeFromDamages) {
      this.freeFromDamages = true
      this.selectedDragObj = null

      if (this.dragObjs.length > 0) {
        for (let dragObj of this.dragObjs) {
          console.log('deleting dragObj')
          dragObj.action = 'remove'
          this.saveDragObj(dragObj);
        }
      }
    } else {
      this.freeFromDamages = false
      const freeObjDamage = this.dragObjs.find((x) => x.freeFromDamages)
      if (freeObjDamage) {
        freeObjDamage.action = 'remove'
        this.saveDragObj(freeObjDamage)
      }
    }

    if (this.freeFromDamages) {
      console.log('add freeImageIcon')
      let randIndex = Math.floor(Math.random() * (100 - 1)) + 1;
      let position = 100 + Math.floor(Math.random() * (100 - 1));
      let findDraggId = this.dragObjs.find((x) => x.freeFromDamages === true)

      let draggableObj: DragObjProperties = {
        id: findDraggId,
        contrato_id: this.contract_id,
        tipo: CheckListTypeEnum.SALIDA,
        width: 140,
        height: 140,
        containerPost: null,
        boxPosition: null,
        objId: randIndex,
        top: 0,
        left: 0,
        action: 'position',
        levelColor: 'default',
        levelTxt: 'Normal',
        indicatorIcon: indicatorIcon,
        indicatorTitle: indicatorTitle,
        enable: false,
        saved: false,
        lock: true,
        freeFromDamages: true
      }
      this.dragObjs.push(draggableObj);
    }

  }

  addDraggedBtn(indicatorIcon, indicatorTitle) {
    let randIndex = Math.floor(Math.random() * (100 - 1)) + 1;
    let position = 100 + Math.floor(Math.random() * (100 - 1));
    let draggableObj: DragObjProperties = {
      id: null,
      contrato_id: this.contract_id,
      tipo: CheckListTypeEnum.SALIDA,
      width: 20,
      height: 20,
      containerPost: null,
      boxPosition: null,
      objId: randIndex,
      top: position,
      left: position,
      action: 'position',
      levelColor: 'default',
      levelTxt: 'Normal',
      indicatorIcon: indicatorIcon,
      indicatorTitle: indicatorTitle,
      enable: true,
      saved: false
    }
    this.dragObjs.push(draggableObj);
  }

  saveDragObj(dragObj: DragObjProperties) {
    if (dragObj) {
      switch (dragObj.action) {
        case 'position':
          dragObj.saved = false;
          let findObj = this.dragObjs.find(x => x.objId === dragObj.objId);
          if (findObj) {
            findObj = dragObj;
          } else {
            this.dragObjs.push(dragObj);
          }
          break;
        case 'remove':
          const dragObjId = dragObj.id;

          let localObjs = null;
          if (localStorage.getItem(this.generalServ.dragObjStorageKey)) {
            localObjs = JSON.parse(localStorage.getItem(this.generalServ.dragObjStorageKey));
          }
          if (localObjs) {
            let findIndexLocalObj = localObjs.findIndex(x => x.objId == dragObj.objId);
            if (findIndexLocalObj !== -1) {
              localObjs.splice(findIndexLocalObj, 1);
              localStorage.setItem(this.generalServ.dragObjStorageKey, JSON.stringify(localObjs));
            }
          }

          let findIndexObj = this.dragObjs.findIndex(x => x.objId === dragObj.objId);
          if (findIndexObj !== -1) {
            this.cancelActionDragObj(dragObj);
            this.dragObjs.splice(findIndexObj, 1);
          }
          if (this.dragObjs.length === 0) {
            localStorage.removeItem(this.generalServ.dragObjStorageKey);
          }

          if (dragObjId) {
            this.checkListServ.remove(dragObjId).subscribe(res => {
              if (res.ok) {
                this.toastServ.presentToast('success', res.message, 'top');
              }
            }, error => {
              console.log(error);
              this.sweetMsgServ.printStatusArray(error.error.errors, 'error');
            })
          }


          break;
      }
      localStorage.setItem(this.generalServ.dragObjStorageKey, JSON.stringify(this.dragObjs));
    }
  }

  catchPickedObj(dragObj: DragObjProperties) {
    if (this.selectedDragObj && (this.selectedDragObj != dragObj)) {
      let findLastDragObj = this.dragObjs.find(x => x.objId === this.selectedDragObj.objId);
      if (findLastDragObj) {
        findLastDragObj.enable = false;
      }
    }

    dragObj.enable = true;
    this.selectedDragObj = dragObj;
  }

  cancelActionDragObj(dragObj: DragObjProperties) {
    dragObj.enable = false;
    this.selectedDragObj = null;
  }

  removeDragObj(dragObj: DragObjProperties) {
    this.sweetMsgServ.confirmRequest('¿Estás seguro de querer eliminar este elemento?').then((data)  => {
      if (data.value) {
        dragObj.action = 'remove';
        this.saveDragObj(dragObj);
      }
    });
  }

  blockUnblockDragObj(dragObj: DragObjProperties, lock: boolean) {
    dragObj.lock = lock;
    this.saveDragObj(dragObj);
  }

  fetchDragObjsFromApi(check_list_salida: DragObjProperties[]) {
    this.dragObjs = check_list_salida;

    let _dataFromStorage: DragObjProperties[] = this.returnIfCheckListInStorage();

    if (_dataFromStorage.length === 0){
      localStorage.removeItem(this.generalServ.dragObjStorageKey);
      for (let i = 0; i < this.dragObjs.length; i++) {
        this.dragObjs[i].enable = false;
      }
    }

    if (_dataFromStorage.length > 0) {
      let _firstUnSaved = _dataFromStorage.find(x => x.saved == false);
      this.catchPickedObj(_firstUnSaved ? _firstUnSaved : _dataFromStorage[0]);
      this.dragObjs = [... _dataFromStorage];
    }
  }

  async openModelosDocModal(dragObj: DragObjProperties) {
    if (!dragObj.id) {
      this.sweetMsgServ.printStatus('Debes guardar primero los cambios del indicador', 'warning');
      return;
    }
    const modal = await this.modalCtr.create({
      component: ModelosDocsComponent,
      componentProps: {
        model: 'check_list',
        docType: 'check_indicator',
        justButton: true,
        fullSize: true,
        model_id_value: dragObj.id,
        asModal: true
      },
      swipeToClose: true,
      cssClass: 'edit-form',
    });
    await  modal.present();
    const {data} = await modal.onWillDismiss();
  }

  async addNote(draggObj: DragObjProperties) {
    if (!draggObj.id) {
      this.sweetMsgServ.printStatus('Debes guardar primero los cambios del indicador', 'warning');
      return;
    }
    const alert = await this.alertController.create({
      cssClass: 'add-note-container',
      header: 'Comentarios',
      inputs: [
        {
          name: 'note',
          type: 'textarea',
          placeholder: 'Comentarios ...'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {

          }
        }, {
          text: 'Ok',
          handler: (_dta) => {
            if (_dta && _dta.note) {
              // if (this.selectedDragObj.notas && this.selectedDragObj.notas.length > 0) {
              //   this.selectedDragObj.notas.push({
              //     nota: _dta.note
              //   });
              // } else {
              //   this.selectedDragObj.notas = [{
              //     nota: _dta.note
              //   }];
              // }
              this.notasServ.saveUpdate(_dta.note, draggObj.id, 'check_list').subscribe(res => {
                if (res.ok) {
                  this.toastServ.presentToast('success', res.message, 'top');
                }
              }, error => {
                console.log(error);
                this.sweetMsgServ.printStatusArray(error.error.errors, 'error');
              })
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async openFullView() {
    const modal = await this.modalCtr.create({
      component: ModalDragElementDetailsComponent,
      componentProps: {
        dragId: this.selectedDragObj.id,
        asModal: true
      },
      swipeToClose: true,
      cssClass: 'edit-form',
    });
    await  modal.present();
    const {data} = await modal.onWillDismiss();
  }


  saveCheckListDB(skipReload?: boolean) {
    if (!this.contract_id) {
      this.sweetMsgServ.printStatus('Debe primero capturar información en datos generales o datos del cliente y guardar su avance para continuar', 'warning');
      return;
    }
    let _payload = {
      payload: this.dragObjs,
      freeFromDamages: this.freeFromDamages
    }
    this.saveProcess('check_in_salida', null, _payload, skipReload);
  }

  returnIfCheckListInStorage() {
    let _unSavedObjs = [];
    if (localStorage.getItem(this.generalServ.dragObjStorageKey)) {
      let localDragObjs = JSON.parse(localStorage.getItem(this.generalServ.dragObjStorageKey));
      if (localDragObjs && localDragObjs.length > 0) {
        for (let i = 0; i < localDragObjs.length; i++) {
          localDragObjs[i].enable = false;
          let _unSavedDragObj = this.dragObjs.find(x => x.objId == localDragObjs[i].objId);
          if (!_unSavedDragObj) {
            localDragObjs[i].saved = false;
            _unSavedObjs.push(localDragObjs[i]);
          } else if (_unSavedDragObj && localDragObjs[i].saved == false) {
            _unSavedObjs.push(localDragObjs[i]);
          } else if (_unSavedDragObj) {
            _unSavedDragObj.enable = false;
            _unSavedObjs.push(_unSavedDragObj);
          }

        }
      }
    }
    return _unSavedObjs;

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

  //TODO: Ver si hay que quitar la lógica de IMG functions
  /*//#region CAPTURE IMG FUNCTIONS
  //TODO: Ver si hay que quitar la lógica de IMG functions
  /!**
   * @deprecated
  * *!/
  processDataImage(event: {imgUrl: string, image: File, type: string, fileName: string}, model = this.docPayLoad.model) {
    this[`${model}_docs`].push({
      file: event.image,
      url: event.imgUrl,
      uploading: false,
      success: null,
      mime_type: event.type,
      fileName: event.fileName
    });
  }

  /!**
   * @deprecated
   * *!/
  disableUploadButton(model = this.docPayLoad.model): boolean {
    if (!this[`${model}_docs`]) {
      return true;
    }

    if (this[`${model}_docs`] && this[`${model}_docs`].length > 0) {
      for (let i = 0; i < this[`${model}_docs`].length; i++) {
        if (!this[`${model}_docs`][i].success || !this[`${model}_docs`][i].file_id || this[`${model}_docs`][i].success === false) {
          return false;
        }
      }
    }
    return true;
  }

  /!**
   * @deprecated
   * *!/
  uploadArrayDatasImg(doc_type = this.docPayLoad.doc_type, model = this.docPayLoad.model, model_id) {
    if (this[`${model}_docs`].length === 0 ) {
      this.sweetMsgServ.printStatus('Debe adjuntar una imagen', 'warning');
      return;
    }

    if (!model_id) {
      this.sweetMsgServ.printStatus('Debe guardar primero la información de esta sección', 'warning');
      return;
    }

    //let _model_id_value;

    this.sweetMsgServ.confirmRequest().then(async (data) => {
      if (data.value) {
        let _lastServError = null;
        let formData = new FormData();
        let _positions = [];
        let _etiquetas = [];
        for (let i = 0; i< this[`${model}_docs`].length; i++) {

          if (!this[`${model}_docs`][i].success || this[`${model}_docs`][i].success === false || !this[`${model}_docs`][i].file_id || this[`${model}_docs`][i].file_id === null) {
            if (!this[`${model}_docs`][i].etiqueta) {
              this[`${model}_docs`][i].fileErrors = 'Ingrese un valor valido';

            } else {
              this[`${model}_docs`][i].fileErrors = null;
            }

            if (this[`${model}_docs`][i].fileErrors) {
              this.sweetMsgServ.printStatus('Revise que los elementos esten correctos', 'warning');
              return;
            }
            // @ts-ignore
            formData.append('files[]', this[`${model}_docs`][i].file, this[`${model}_docs`][i].file.name);
            //this.docDataTransfer[i].uploading = true;
            _positions.push(i);
            _etiquetas.push(this[`${model}_docs`][i].etiqueta);
          }
        }

        formData.set('doc_type', doc_type);
        formData.set('model', model);
        formData.set('model_id', model_id);
        //formData.set('model_id_value', String(_model_id_value));
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
            this[`${model}_docs`][_resPayload[i].position].success = _resPayload[i].success;
            this[`${model}_docs`][_resPayload[i].position].file_id = _resPayload[i].file_id;
            this[`${model}_docs`][_resPayload[i].position].model = _resPayload[i].model;
            this[`${model}_docs`][_resPayload[i].position].model_id = _resPayload[i].model_id;
            //this[`${model}_docs`][_resPayload[i].position].model_id_value = _resPayload[i].model_id_value;
            this[`${model}_docs`][_resPayload[i].position].position = _resPayload[i].position;
            this[`${model}_docs`][_resPayload[i].position].doc_type = _resPayload[i].doc_type;
            _lastIndex = i;
          }
        } else {
          _lastServError = res.error.errors;
        }

        let successTotal = 0;
        for (let j = 0; j < this[`${model}_docs`].length; j++) {
          if (this[`${model}_docs`][j].success === true) {
            successTotal ++;
          }
        }
        if (successTotal === this[`${model}_docs`].length) {
          this.sweetMsgServ.printStatus('Se han guardado sus imagenes de manera correcta', 'success');
          if (model === 'contratos') {
            this.saveProcess('datos_generales', true);
          }
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

  /!**
   * @deprecated
   * *!/
  removeImg(index, model = this.docPayLoad.model) {
    this[`${model}_docs`].splice(index, 1);
  }

  /!**
   * @deprecated
   * *!/
  async removeFromDisk(fileData: DocDataTransfer, index, model = this.docPayLoad.model) {
    await this.sweetMsgServ.confirmRequest('¿Estás seguro de querer eliminar el archivo?').then(async (data) => {
      if (data.value) {
        let _payload = {
          doc_type: fileData.doc_type,
          model: fileData.model,
          model_id: fileData.model_id,
          //model_id_value: fileData.model_id_value,
          id: fileData.file_id
        }
        let query = await this.filesServ.deleteDoc(_payload);
        if (query.ok) {
          this.sweetMsgServ.printStatus(query.data.message, 'success');
          this.removeImg(index, model);
        } else {
          this.sweetMsgServ.printStatusArray(query.error.error.errors, 'error');
          console.log(query.error);
        }
      }
    });
  }

  /!**
   * @deprecated
   * *!/
  async getDocs(doc_type = this.docPayLoad.doc_type, model = this.docPayLoad.model, model_id: number) {
    let _payload = {
      doc_type,
      model,
      model_id
    }
    let res = await this.filesServ.getDocs(_payload);

    if (res.ok) {
      this[`${model}_docs`] = [];

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
          etiqueta: res.data[i].etiqueta
        }
        this[`${model}_docs`].push(_docData);
      }
    } else {
      this[`${model}_docs`] = [];
      console.log('error --->', res.error);
    }
  }

  /!**
   * @deprecated
   * *!/
  isImage(fileType: string): boolean {
    let imgTypes = ['image/png', 'image/jpg', 'image/jpeg'];
    let find = imgTypes.find(x => x === fileType);
    return find && find !== 'unknown';
  }
  //#endregion*/

  //#region CARDS MANAGEMENT
  async agregarPagoOpt(cobranza_seccion) {
    if(cobranza_seccion == 'salida') {
      const actionSheet = await this.actionSheetController.create({
        header: 'Opciones',
        cssClass: 'my-custom-class',
        backdropDismiss: false,
        buttons: [
          {
            text: 'Pago con Tarjeta',
            icon: 'card',
            cssClass:   this.balancePorPagar <= 0 ? 'disable' : '',
            handler: () => {
              this.agregarTarjetaForm(CobranzaTipoE.PAGOTARJETA,cobranza_seccion , null, true);
            },
          },
          {
            text: 'Pago Efectivo',
            icon: 'cash',
            cssClass: this.balancePorPagar <= 0 ? 'disable' : '',
            handler: () => {
              this.capturarCobroInput(null, cobranza_seccion, 'efectivo');
            },
          },
          {
            text: 'Captura Pre-Autorización',
            icon: 'card',
            handler: () => {
              this.agregarTarjetaForm(CobranzaTipoE.PREAUTHORIZACION, cobranza_seccion, null, true);
            },
          },
          {
            text: 'Cancelar',
            icon: 'close',
            role: 'cancel',
            cssClass: 'action-sheet-cancel',
            handler: () => {
            },
          },
        ],
      });

      await actionSheet.present();

      const { role } = await actionSheet.onDidDismiss();

    } else {
      const actionSheet = await this.actionSheetController.create({
        header: 'Opciones',
        cssClass: 'my-custom-class',
        backdropDismiss: false,
        buttons: [
          {
            text: 'Pago con Tarjeta',
            icon: 'card',
            cssClass:   this.balanceRetornoPorPagar <= 0 ? 'disable' : '',
            handler: () => {
              this.agregarTarjetaForm(CobranzaTipoE.PAGOTARJETA, cobranza_seccion, null, true);
            },
          },
          {
            text: 'Pago Efectivo',
            icon: 'cash',
            cssClass: this.balanceRetornoPorPagar <= 0 ? 'disable' : '',
            handler: () => {
              this.capturarCobroInput(null, cobranza_seccion, 'efectivo');
            },
          },
          {
            text: 'Pago con Depósito',
            icon: 'cash',
            cssClass: this.balanceRetornoPorPagar <= 0 ? 'disable' : '',
            handler: () => {
             this.capturaDeposito('retorno')
            },
          },
          {
            text: 'Cancelar',
            icon: 'close',
            role: 'cancel',
            cssClass: 'action-sheet-cancel',
            handler: () => {
            },
          },
        ],
      });
      await actionSheet.present();

      const { role } = await actionSheet.onDidDismiss();
    }


  }

  async agregarTarjetaForm(tipo: CobranzaTipoE.PAGOTARJETA | CobranzaTipoE.PREAUTHORIZACION, cobranza_seccion ,_data?: CardI, pushData?: boolean, cobranza: CobranzaProgI = null) {
    let _titular = this.cf.nombre.value;
    const modal = await this.modalCtr.create({
      component: TarjetaFormComponent,
      componentProps: {
        'asModal': true,
        'card_id': (_data && _data.id) ? _data.id : null,
        'cliente_id': this.cf.cliente_id.value,
        'loadLoading': false,
        'returnCapture': true,
        'needCaptureAmount': true,
        'cod_banco': (cobranza && cobranza.cod_banco) ? cobranza.cod_banco : null,
        'montoCobrado': (cobranza && cobranza.monto_cobrado) ? cobranza.monto_cobrado : null,
        'tipoPago': tipo,
        'titularTarj': _titular,
        'montoCobrar': (cobranza_seccion == 'salida') ? this.balancePorPagar : this.balanceRetornoPorPagar,
        'divisa_id': (cobranza && cobranza.tipo_cambio_usado?.divisa_base_id) ? cobranza.tipo_cambio_usado.divisa_base_id : null
      },
      swipeToClose: true,
      cssClass: 'edit-form',
      //presentingElement: pageEl
    });
    await modal.present();
    const {data} = await modal.onWillDismiss();
    if (data && data.info) {
      if (pushData && pushData === true) {
        let _prepare: CobranzaProgI = {
          id: null,
          tarjeta: data.info,
          edit: false,
          contrato_id: this.contract_id,
          cliente_id: this.cf.cliente_id.value,
          cod_banco: data.info.cod_banco,
          tarjeta_id: data.info.id,
          estatus: null,
          created_at: null,
          fecha_cargo: null,
          fecha_procesado: null,
          fecha_reg: null,
          tipo_cambio_id: data.info.tipoCambio.id,
          tipo_cambio: data.info.tipoCambio.tipo_cambio,
          cobranza_seccion: cobranza_seccion,
          moneda: this.baseCurrency,
          moneda_cobrada: data.info.tipoCambio.divisa_base,
          monto: data.info.monto,
          monto_cobrado: data.info.monto_cobrado,
          tipo: data.info.c_charge_method,
          res_banco: null,
          updated_at: null,
          cobranza_id: (cobranza && cobranza.id) ? cobranza.id : null
        }
        this.saveProcess((cobranza_seccion == 'salida') ? 'cobranza' : 'cobranza_retorno', null, _prepare);
      }
      return data.info
    } else {
      return null;
    }
  }

  async capturarCobroInput(cobranza: CobranzaProgI = null, cobranza_seccion, cobranzaTipo: CobranzaTipo) {
    const modal = await this.modalCtr.create({
      component: InputModalComponent,
      componentProps: {
        'asModal': true,
        'montoCobrado': (cobranza && cobranza.monto_cobrado) ? cobranza.monto_cobrado : null,
        'balanceCobro':(cobranza_seccion == 'salida') ?  this.balancePorPagar : this.balanceRetornoPorPagar,
        'cobranza_id': (cobranza && cobranza.id) ? cobranza.id : null,
        'divisa_id': (cobranza && cobranza.tipo_cambio_usado?.divisa_base_id) ? cobranza.tipo_cambio_usado.divisa_base_id : null,
        'cobranzaTipo': cobranzaTipo
      },
      swipeToClose: true,
      cssClass: 'small-form',
      //presentingElement: pageEl
    });
    await modal.present();
    const {data} = await modal.onWillDismiss();
    if (data && data.info) {
      let _prepare: CobranzaProgI = {
        id: null,
        tarjeta: null,
        edit: false,
        contrato_id: this.contract_id,
        cliente_id: this.cf.cliente_id.value,
        cod_banco: null,
        tarjeta_id: null,
        estatus: null,
        created_at: null,
        cobranza_seccion: cobranza_seccion,
        fecha_cargo: null,
        fecha_procesado: null,
        fecha_reg: null,
        tipo_cambio_id: data.info.tipoCambio.id,
        tipo_cambio: data.info.tipoCambio.tipo_cambio,
        moneda: this.baseCurrency,
        moneda_cobrada: data.info.tipoCambio.divisa_base,
        monto: data.info.monto,
        monto_cobrado: data.info.monto_cobrado,
        tipo: CobranzaTipoE.PAGOEFECTIVO,
        res_banco: null,
        updated_at: null,
        cobranza_id: (cobranza && cobranza.id) ? cobranza.id : null
      }
      this.saveProcess((cobranza_seccion == 'salida') ? 'cobranza' : 'cobranza_retorno', null, _prepare);
      return data.info
    } else {
      return null;
    }
  }

  async capturaDeposito(cobranza_seccion: 'salida' | 'retorno') {
    const modal = await this.modalCtr.create({
      component: CobroDepositoModalComponent,
      componentProps: {
        'asModal': true,
        'balanceCobro':(cobranza_seccion == 'salida') ?  this.balancePorPagar : this.balanceRetornoPorPagar,
        'contrato_id': this.contract_id,
        'num_contrato': this.num_contrato,
        'cliente_id': this.contractData.cliente.id
      },
      swipeToClose: true,
      cssClass: 'large-form'
      //presentingElement: pageEl
    });
    await modal.present();
    const {data} = await modal.onWillDismiss();
    if (data) {
      console.log(data)
      if (data.reload) {
        await this.reloadAll();
      }
    } else {
      return null;
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
    let _payload = null;
    if (this.selectedTarifaCat && this.selectedTarifaCat.id) {
      _payload = {
        orderBy: 'tarifa_categoria_id',
        tarifa_categoria_id: this.selectedTarifaCat.id,
        estatus: VehiculosStatusE.DISPONIBLE
      }
    }
    const modal = await this.modalCtr.create({
      component: MultiTableFilterComponent,
      componentProps: {
        'asModal': true,
        'endpoint': _endpoint,
        'payload': _payload
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
          //this.getDocs('licencia_conducir', 'clientes', data.id);
          break;
        case 'vehiculo':
          this.vehiculoData = data;
          this.setVehiculoBackgroundLayout(this.vehiculoData.categoria_vehiculo_id, this.vehiculoData.categoria.categoria);
          //this.vehicleOutlineBackground = this.vehiculoData.categoria.categoria.toLowerCase();
          this.initVehiculoForm(this.vehiculoData);
          //this.gf.vehiculo_id.patchValue(this.vehiculoData.id);
          //this.gf.vehiculo_clase_id.patchValue(this.vehiculoData.clase_id);
          //this.initTipoTarifaRule(true);
          break;
        case 'ubicacionSalida':
          this.gf.ub_salida_id.patchValue(data.id);
          break;
        case 'ubicacionRetorno':
          this.gf.ub_retorno_id.patchValue(data.id);
          break;
      }
    }
  }
  //#endregion

  //#region CALCULATION BUSINESS RULES

  // 1. Revisamos el tipo de tarifa (Apollo, Hotel, Comisionista)
  initTipoTarifaRule(withInitRules?: boolean) {
    if (!this.gf.tipo_tarifa.value) {
      this.sweetMsgServ.printStatus('Seleccione un tipo de tarifa para aplicar', 'warning');
      this.gf.tipo_tarifa.markAllAsTouched();
      return;
    }
    let _tipoTarifa = this.tiposTarifas.find(x => x.tarifa === this.gf.tipo_tarifa.value);
    this.gf.tipo_tarifa_id.patchValue(_tipoTarifa.id);

    // if (this.vehiculoData && this.vehiculoData.precio_renta) {
    //   this.gf.precio_unitario_inicial.patchValue(this.vehiculoData.precio_renta);
    // }

    switch (TxtConv.txtCon(_tipoTarifa.tarifa, 'uppercase')) {
      case 'APOLLO':
        this.gf.modelo_id.patchValue(null);
        this.generalDataForm.controls.modelo_id.removeValidators([Validators.required])
        this.gf.modelo.patchValue(ModelsEnum.APOLLO);
        this.gf.folio_cupon.patchValue(null);
        //this.gf.valor_cupon.patchValue(null);
        this.gf.comision.patchValue(null);
        this.resetTarifasData();
        break;
      case 'HOTEL':
        if (!withInitRules) {
          this.gf.modelo_id.patchValue(null);
          this.gf.modelo_id.removeValidators(Validators.required);
        }

        this.gf.modelo.patchValue(ModelsEnum.HOTELES);
        this.gf.precio_unitario_final.patchValue(null);
        //this.selectedTarifaCat = null;
        //this.gf.con_descuento.patchValue(null);
        //this.resetTarifasData();
        break;
      case 'COMISIONISTA':
        this.gf.precio_unitario_final.patchValue(null);
        this.gf.modelo_id.patchValue(null);
        this.gf.modelo.patchValue(ModelsEnum.COMISIONISTAS);
        this.gf.folio_cupon.patchValue(null);
        //this.gf.valor_cupon.patchValue(null);
        this.gf.comision.patchValue(null);
        this.resetTarifasData();
        break;
    }
    this.startDateChange();
    this.setReturnDateChange();
  }

  resetTarifasData() {
    this.gf.vehiculo_clase_id.patchValue(null);
    this.gf.vehiculo_clase.patchValue(null);
    this.gf.vehiculo_clase_precio.patchValue(null);
    this.gf.comision.patchValue(null);

    // if (this.vehiculoData) {
    //   this.gf.vehiculo_clase_id.patchValue(this.vehiculoData.clase_id);
    //   this.gf.vehiculo_clase.patchValue(this.vehiculoData.clase.clase);
    //   this.gf.vehiculo_clase_precio.patchValue(this.vehiculoData.precio_renta);
    // }

    //TODO: new flow
    this.gf.tarifa_modelo.patchValue(null);
    this.gf.tarifa_modelo_id.patchValue(null);
    this.gf.tarifa_apollo_id.patchValue(null);
    this.gf.tarifa_modelo_label.patchValue(null);
    this.gf.tarifa_modelo_precio.patchValue(null);
    this.gf.tarifa_modelo_obj.patchValue(null);
    this.gf.con_descuento.disable();
    this.gf.con_descuento.patchValue(null);

    this.prepareDescuentos(this.selectedTarifaCat, false);
  }

  setTarifasCat(withMakeCalc: boolean) {
    let tarifaCat: TarifasCategoriasI = this.tarifasCategorias.find(x => x.id === this.gf.tarifa_modelo_id.value);
    if (!tarifaCat.tarifas_apollo || tarifaCat.tarifas_apollo.length === 0) {
      this.sweetMsgServ.printStatus('Esta opción no aplica para descuento', 'warning');
    }
    this.selectedTarifaCat = null;
    this.gf.con_descuento.patchValue(null);
    this.gf.tarifa_modelo.patchValue(ModelsEnum.TARIFASCAT);
    this.gf.tarifa_modelo_id.patchValue(tarifaCat.id);
    this.gf.tarifa_apollo_id.patchValue(null);
    this.gf.tarifa_modelo_label.patchValue(tarifaCat.categoria);
    this.gf.tarifa_modelo_precio.patchValue(tarifaCat.precio_renta);
    this.gf.tarifa_modelo_obj.patchValue(tarifaCat);

    this.gf.precio_unitario_inicial.patchValue(tarifaCat.precio_renta);
    this.gf.precio_unitario_final.patchValue(tarifaCat.precio_renta);

    this.selectedTarifaCat = tarifaCat;

    this.prepareDescuentos(this.selectedTarifaCat, false);

    //TODO: makeCalc?
    if (withMakeCalc) {
      this.makeCalc();
    }
  }

  prepareDescuentos(tarifaCat: TarifasCategoriasI | TarifaHotelesI, enable: boolean) {
    if (tarifaCat && tarifaCat.tarifas_apollo && tarifaCat.tarifas_apollo.length > 0) {
      for (let i = 0; i < tarifaCat.tarifas_apollo.length; i++) {
        tarifaCat.tarifas_apollo[i].enable = enable;
      }
    }
  }

  enableDisableDescuentoFreq(enable: boolean) {
    if (this.gf.total_dias.value && this.selectedTarifaCat && this.selectedTarifaCat.tarifas_apollo) {
      let _totalDias = this.gf.total_dias.value;
      for (let i = 0; i < this.selectedTarifaCat.tarifas_apollo.length; i++) {
        if (this.selectedTarifaCat.tarifas_apollo[i].frecuencia_ref == 'weeks' && (_totalDias >= 7)) {
          this.selectedTarifaCat.tarifas_apollo[i].enable = enable;
          this.gf.con_descuento.enable();
        } else if (this.selectedTarifaCat.tarifas_apollo[i].frecuencia_ref === 'months' && _totalDias >= 30) {
          this.selectedTarifaCat.tarifas_apollo[i].enable = enable;
          this.gf.con_descuento.enable();
        } else {
          this.selectedTarifaCat.tarifas_apollo[i].enable = false;
          if (this.gf.tarifa_apollo_id.value == this.selectedTarifaCat.tarifas_apollo[i].id) {
            this.gf.tarifa_apollo_id.patchValue(null);
          }
        }
      }
    }
  }

  loadHotelTarifas(withInitRules: boolean) {
    let _hotelTarifas = this.hoteles.find(x => x.id === this.gf.modelo_id.value);
    if (_hotelTarifas) {
      this.tarifasHotel = _hotelTarifas.tarifas;
    }
    if (this.tarifasHotel && this.tarifasHotel.length === 0) {
      this.sweetMsgServ.printStatus('Este hotel no tiene un plan tarifario configurado, comunicate con el administrador', 'warning');
      this.gf.modelo_id.patchValue(null);
      return;
    }
    if (!this.gf.vehiculo_clase_id.value) {
      if (this.vehiculoData) {
        this.gf.vehiculo_clase_id.patchValue(this.vehiculoData.clase_id);
      }
    }

    // if (!withInitRules) {
    //   this.gf.vehiculo_clase_id.patchValue(null);
    // }

    this.setVehiculoClaseData(withInitRules);

    this.selectedTarifaCat = _hotelTarifas.tarifas.find(tarifa => tarifa.clase_id === this.gf.vehiculo_clase_id.value);
  }

  setVehiculoClaseData(withInitRules: boolean) {
    if (TxtConv.txtCon(this.gf.tipo_tarifa.value, 'uppercase') === 'HOTEL') {
      let _clases = this.tarifasHotel.find(x => x.clase_id === this.gf.vehiculo_clase_id.value);
      if (_clases) {
        this.gf.vehiculo_clase.patchValue(_clases.clase);
        this.gf.vehiculo_clase_precio.patchValue(_clases.precio_renta);
        this.gf.precio_unitario_inicial.patchValue(null); // TODO: agregar precio unitario al escoger vehiculo data
        this.gf.precio_unitario_final.patchValue(_clases.precio_renta);

        this.gf.tarifa_modelo.patchValue(ModelsEnum.TARIFASHOTEL);
        this.gf.tarifa_modelo_id.patchValue(_clases.id);
        //this.gf.tarifa_apollo_id.patchValue(null);
        this.gf.tarifa_modelo_label.patchValue(_clases.clase);
        this.gf.tarifa_modelo_precio.patchValue(_clases.precio_renta);
        this.gf.tarifa_modelo_obj.patchValue(_clases);

        this.selectedTarifaCat = this.tarifasHotel.find(tarifa => tarifa.clase_id === this.gf.vehiculo_clase_id.value);

        if (withInitRules === true) {
          this.initTipoTarifaRule(withInitRules);
        }
      }
    }
  }

  setComisiones(clear: boolean) {
    this.comisiones = null;
    let _comisionesValues = this.comisionistas.find(x => x.id === this.gf.modelo_id.value);
    if (_comisionesValues) {
      this.comisiones = _comisionesValues.comisiones_pactadas;
    }
    if (clear === true) {
      this.gf.comision.setValue(null);
      this.gf.precio_unitario_final.patchValue(null);
      this.initCalcComisionista();
    }
  }

  initCalcComisionista() {
    this.startDateChange();
    this.setReturnDateChange();
  }

  startDateChange() {
    if (this.contractFechaSalida) {
      this.rangoFechas.fecha_salida.patchValue(this.contractFechaSalida);
    }
  }

  setReturnDateChange(inputDays?, byDays?: boolean) {
    this._maxDate = DateConv.transFormDate(this._today, 'moment').add(30, 'days');
    if (!inputDays && byDays) {
      this.gf.total_dias.patchValue( null);
      this.rangoFechas.fecha_salida.patchValue(this._today);
      this.rangoFechas.fecha_retorno.patchValue(null);
      return;
    }
    if (inputDays) {
      //let _returnDate = moment().add(inputDays, 'days');
      let _returnDate = DateConv.transFormDate(this._today, 'moment').add(inputDays, 'days');
      this.rangoFechas.fecha_retorno.patchValue(_returnDate);
      //return;
    } else {
      if (this.rangoFechas.fecha_retorno.invalid) {
        this.rangoFechas.fecha_retorno.markAllAsTouched();
        return;
      }
      this.gf.total_dias.patchValue(DateConv.diffDays(this.rangoFechas.fecha_salida.value, this.rangoFechas.fecha_retorno.value));
    }
    setTimeout(() => {
      this.setBaseRentFrequency()
    }, 300);


    this.makeCalc();
  }

  async makeCalc(elementType?: string, cobro?: CobranzaCalcI) {
    if (this.gf.tipo_tarifa.invalid) {
      this.sweetMsgServ.printStatus('Selecciona el tipo de tarífa', 'warning');
      this.gf.tipo_tarifa.markAllAsTouched();
      return;
    }

    this.gf.valor_cupon.patchValue(null);

    let _tempExtrasCalc = this.cobranzaI.filter(x => x.element === 'extra');
    this.cobranzaI = [];

    let _totalDias = this.gf.total_dias.value;
    this.gf.modelo_id.removeValidators(Validators.required);
    this.gf.comision.removeValidators(Validators.required);

    if (!this.gf.con_descuento.value) {
      this.gf.tarifa_apollo_id.patchValue(null);
      this.gf.tarifa_apollo_id.removeValidators(Validators.required);
    } else {
      if (!this.gf.tarifa_apollo_id.value) {
        this.gf.tarifa_apollo_id.setValidators(Validators.required);
        this.gf.tarifa_apollo_id.markAllAsTouched();
        //return;
      }
    }

    let _tarifas;
    let _tarifa;

    switch (TxtConv.txtCon(this.gf.tipo_tarifa.value, 'uppercase')) {
      case 'APOLLO':
      case 'HOTEL':
        //TODO: borrar si ya no es necesario
        // if (!this.vehiculoData.tarifas) {
        //   console.log('El vehículo seleccionado no cuenta con un plan tarifario, comuniquese con el administrador');
        //   this.sweetMsgServ.printStatus('El vehículo seleccionado no cuenta con un plan tarifario, comuniquese con el administrador', 'error');
        //   return;
        // }
        // let _tarifas = this.vehiculoData.tarifas;
        if (!this.gf.tarifa_modelo_id.value) {
          //this.sweetMsgServ.printStatus('Debe seleccionar una tarifa x categoría valída', 'error');
          this.gf.tarifa_modelo_id.markAllAsTouched();
          return;
        }

        _tarifas = this.selectedTarifaCat.tarifas_apollo;

        this.gf.precio_unitario_inicial.patchValue(this.selectedTarifaCat.precio_renta);
        this.gf.precio_unitario_final.patchValue(this.selectedTarifaCat.precio_renta);

        // if (_totalDias < 7) {
        //   this.baseRentFrequency = 'days';
        // } else if (_totalDias >= 7 && _totalDias < 30) {
        //   this.baseRentFrequency = 'weeks';
        // } else if (_totalDias >= 30) {
        //   this.baseRentFrequency = 'months';
        // }
        //
        // this.enableDisableDescuentoFreq(true);

        this.setBaseRentFrequency();

        _tarifa = _tarifas.find(x => x.frecuencia_ref == this.baseRentFrequency);

        if (_tarifa && this.gf.tarifa_modelo_id.value &&  (_tarifa.ap_descuento === true || _tarifa.ap_descuento == 1)) {
          this.gf.con_descuento.enable();
          _tarifa.enable = true;
        } else {
          this.gf.con_descuento.disable();
          this.gf.con_descuento.patchValue(null);
          this.gf.tarifa_apollo_id.patchValue(null);
          this.prepareDescuentos(this.selectedTarifaCat, false);
        }

        let _precioBase = (_tarifa && _tarifa.precio_base) ? _tarifa.precio_base : this.selectedTarifaCat.precio_renta;

        this.cobranzaI.push({
          element: 'renta',
          value: _precioBase,
          quantity: _totalDias,
          quantity_type: 'dias',
          element_label: 'Renta',
          number_sign: 'positive',
          amount: parseFloat(Number(_precioBase * _totalDias).toFixed(2)),
          currency: this.baseCurrency
        });

        // Verificamos si tenemos descuento
        if (_tarifa && (_tarifa.ap_descuento == true || _tarifa.ap_descuento == 1) && (this.gf.tarifa_apollo_id.value) && (this.gf.con_descuento.value == true || this.gf.con_descuento.value == 1)) {
          let tarifaApolloConf = _tarifas.find(x => x.id === this.gf.tarifa_apollo_id.value);
          if (tarifaApolloConf) {
            this.cobranzaI.push({
              element: 'descuento',
              value: null,
              quantity: tarifaApolloConf.valor_descuento,
              quantity_type: '%',
              element_label: 'Descuento',
              number_sign: 'negative',
              amount: parseFloat(Number(tarifaApolloConf.precio_base * (tarifaApolloConf.valor_descuento / 100) * _totalDias).toFixed(2)),
              currency: this.baseCurrency
            });
          }
        }

        // Veriricamos si tenemos cupón
        let descuentoCupon = 0;
        for (let cobro of this.cobranzaI) {
          descuentoCupon =  descuentoCupon + (cobro.number_sign === 'negative' ? -cobro.amount : +cobro.amount)
        }
        if (this.gf.folio_cupon.value) {
          this.cobranzaI.push({
            element: 'descuento_cupon',
            value: null,
            quantity: 100,
            quantity_type: '%',
            element_label: 'Descuento Cupón',
            number_sign: 'negative',
            amount: parseFloat(Number(descuentoCupon).toFixed(2)),
            currency: this.baseCurrency
          });
        }

        //colocamos valor del cupón
        this.gf.valor_cupon.patchValue(descuentoCupon)

        break;
      // case 'HOTEL':
      //   console.log('makeCalc', this.generalDataForm.value);
      //   if (!this.gf.modelo_id.value) {
      //     this.sweetMsgServ.printStatus('Seccione un hotel de la lista', 'warning');
      //     this.gf.modelo_id.setValidators(Validators.required);
      //     this.gf.modelo_id.markAllAsTouched();
      //     return;
      //   }
      //   this.setVehiculoClaseData(false);
      //   let _precioUnitario = this.gf.precio_unitario_final.value;
      //
      //   this.cobranzaI.push({
      //     element: 'renta',
      //     value: _precioUnitario,
      //     quantity: _totalDias,
      //     quantity_type: 'dias',
      //     element_label: 'Renta',
      //     number_sign: 'positive',
      //     amount: parseFloat(Number(_precioUnitario * _totalDias).toFixed(2)),
      //     currency: this.baseCurrency
      //   });
      //   break;
      case 'COMISIONISTA':
        if (!this.selectedTarifaCat || !this.gf.tarifa_modelo_id.value) {
          this.gf.tarifa_modelo_id.markAllAsTouched();
          return;
        }
        if (!this.gf.modelo_id.value) {
          this.sweetMsgServ.printStatus('Seccione un comisionista de la lista', 'warning');
          this.gf.modelo_id.setValidators(Validators.required);
          this.gf.modelo_id.markAllAsTouched();
          return;
        }
        if (!this.gf.comision.value) {
          //this.sweetMsgServ.printStatus('Seccione un comisionista de la lista', 'warning');
          this.gf.comision.setValidators(Validators.required);
          this.gf.comision.markAllAsTouched();
          return;
        }
        _tarifas = this.selectedTarifaCat.tarifas_apollo;

        this.gf.precio_unitario_inicial.patchValue(this.selectedTarifaCat.precio_renta);
        let _nuevoPrecioUnitario = Number(this.gf.precio_unitario_inicial.value) + Number(this.gf.comision.value);
        this.gf.precio_unitario_final.patchValue(_nuevoPrecioUnitario);

        this.setBaseRentFrequency();

        _tarifa = _tarifas.find(x => x.frecuencia_ref == this.baseRentFrequency);
        _tarifa.enable = true;

        if (this.gf.tarifa_modelo_id.value &&  _tarifa.ap_descuento === true || _tarifa.ap_descuento == 1) {
          this.gf.con_descuento.enable();
        } else {
          this.gf.con_descuento.disable();
          this.gf.con_descuento.patchValue(null);
          this.gf.tarifa_apollo_id.patchValue(null);
          this.prepareDescuentos(this.selectedTarifaCat, false);
        }

        this.cobranzaI.push({
          element: 'renta',
          value: _nuevoPrecioUnitario,
          quantity: _totalDias,
          quantity_type: 'dias',
          element_label: 'Renta',
          number_sign: 'positive',
          amount: parseFloat(Number(_nuevoPrecioUnitario * _totalDias).toFixed(2)),
          currency: this.baseCurrency
        });

        // Verificamos si tenemos descuento
        if (_tarifa && (_tarifa.ap_descuento == true || _tarifa.ap_descuento == 1) && this.gf.tarifa_apollo_id.value && (this.gf.con_descuento.value == true || this.gf.con_descuento.value == 1)) {
          let tarifaApolloConf = _tarifas.find(x => x.id === this.gf.tarifa_apollo_id.value);
          if (tarifaApolloConf) {
            this.cobranzaI.push({
              element: 'descuento',
              value: null,
              quantity: tarifaApolloConf.valor_descuento,
              quantity_type: '%',
              element_label: 'Descuento',
              number_sign: 'negative',
              amount: parseFloat(Number(_nuevoPrecioUnitario * (tarifaApolloConf.valor_descuento / 100) * _totalDias).toFixed(2)),
              currency: this.baseCurrency
            });
          }
        }

        break;
      default:
        this.gf.tipo_tarifa.markAllAsTouched();
        return
    }

    // Verificamos si tenemos extras
    if (this.gf.cobros_extras.value && this.gf.cobros_extras.value.length > 0) {

      if (elementType && elementType === 'extra' && cobro) {
        this.cobranzaI.push(... _tempExtrasCalc);

        let _singleCobro = this.cobranzaI.find(x => x.element_label === cobro.element_label);
        let _extraInForm = this.gf.cobros_extras.value.find(x => x.nombre === cobro.element_label);
        let _index = this.cobranzaI.findIndex(x => x.element_label === cobro.element_label);

        if (_singleCobro && _extraInForm && _index) {
          _singleCobro.quantity = cobro.quantity;
          _singleCobro.amount = parseFloat(Number(_extraInForm.precio * cobro.quantity * _totalDias).toFixed(2))
          this.cobranzaI[_index] = _singleCobro;
        }
      } else {
        for (let i = 0; i < this.gf.cobros_extras.value.length; i++) {

          this.cobranzaI.push({
            element:  'extra',
            value:  this.gf.cobros_extras.value[i].precio,
            quantity:   1,
            quantity_type:  '',
            element_label:  this.gf.cobros_extras.value[i].nombre,
            number_sign:  'positive',
            amount:  parseFloat(Number(this.gf.cobros_extras.value[i].precio * 1 * _totalDias).toFixed(2)),
            currency: this.baseCurrency
          })


        }
      }

      //recalculamos balance x cobrar
      this.recalBalancePorCobrar()

    }

    // sacamos subtotal, iva y total final
    let _subtotal = 0;
    let _iva = 0;
    let _total = 0;
    for (let i = 0; i < this.cobranzaI.length; i++) {
      _subtotal = _subtotal + ((this.cobranzaI[i].amount * (this.cobranzaI[i].number_sign === 'positive' ? 1 : -1)));
    }
    //_subtotal = parseFloat(Number(_subtotal).toFixed(2)) - parseFloat(Number(this.gf.precio_unitario_final.value * _totalDias).toFixed(2));

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

  async makeCalcRetorno(elementType?: string, cobro?: CobranzaCalcI) {
    if (this.rf.cargos_extras_retorno_ids.value && this.rf.cargos_extras_retorno_ids.value.length == 0) {
      this.sweetMsgServ.printStatus('Selecciona los cargos extras', 'warning');
      return;
    }

    let cobranza_temp = JSON.parse(JSON.stringify(this.cobranzaRetornoI));
    this.cobranzaRetornoI = [];
    this.checkExtraChargeFrecuency();

    let _totalFrecuenciaExtra = this.rf.frecuencia_extra.value;
    let _precioUnitario = (this.cobranzaExtraPor == 'horas') ? this.gf.precio_unitario_final.value / 24 : this.gf.precio_unitario_final.value;
    let _precioExtraDia = this.gf.precio_unitario_final.value;
    let _precioExtraHora = parseFloat(Number(this.gf.precio_unitario_final.value / 24).toFixed(2));
    console.log("Precio Dia----->", _precioExtraDia);
    console.log("Precio Hora----->", _precioExtraHora);

    // Verificamos si tenemos extras
    if (this.rf.cargos_extras_retorno.value && this.rf.cargos_extras_retorno.value.length > 0) {

      let _tempExtrasCalc = cobranza_temp.filter(x => x.element === 'cargoExtra');
      console.log('tempExtrasCalc', _tempExtrasCalc);
      if (elementType && elementType === 'extra' && cobro) {
        this.cobranzaRetornoI.push(... _tempExtrasCalc);

        let _singleCobro = this.cobranzaRetornoI.find(x => x.element_label === cobro.element_label);
        let _extraInForm = this.rf.cargos_extras_retorno.value.find(x => x.nombre === cobro.element_label);
        let _index = this.cobranzaRetornoI.findIndex(x => x.element_label === cobro.element_label);
        if (_singleCobro && _extraInForm && (_index + 1)) {
          _singleCobro.quantity = cobro.quantity;
          _singleCobro.amount = parseFloat(Number(_extraInForm.precio * cobro.quantity ).toFixed(2))
          this.cobranzaRetornoI[_index] = _singleCobro;
        }
      } else {
        for (let i = 0; i < this.rf.cargos_extras_retorno.value.length; i++) {

          let _quantity = (this.rf.cargos_extras_retorno.value[i].tipo == 'gasolina') ? (this.convertFractionToLiters(this.vf.cant_combustible_salida.value) - this.convertFractionToLiters(this.rf.cant_combustible_retorno.value)) : 1;
          this.cobranzaRetornoI.push({
            element:  'cargoExtra',
            value:  this.rf.cargos_extras_retorno.value[i].precio,
            quantity:  _quantity,
            quantity_type:  '',
            element_label:  this.rf.cargos_extras_retorno.value[i].nombre,
            number_sign:  'positive',
            amount:  parseFloat(Number(this.rf.cargos_extras_retorno.value[i].precio * _quantity ).toFixed(2)),
            currency: this.baseCurrency
          })


        }
      }
    }

    if (this.frecuencia_extras_toggle && _totalFrecuenciaExtra && _totalFrecuenciaExtra > 0) {
      this.cobranzaRetornoI.push({
        element: (this.cobranzaExtraPor == 'horas') ? 'horas_extra' : 'dias_extra',
        value:  _precioUnitario,
        quantity:   _totalFrecuenciaExtra,
        quantity_type: (this.cobranzaExtraPor == 'horas') ? 'horas' : 'dias',
        element_label: (this.cobranzaExtraPor == 'horas') ? 'Horas extras' :'Dias extras',
        number_sign:  'positive',
        amount:  parseFloat(Number(_precioUnitario * _totalFrecuenciaExtra ).toFixed(2)),
        currency: this.baseCurrency
      })
      this.rf.cobranzaExtraPor.patchValue(this.cobranzaExtraPor);
    }

    let _subtotal = 0;
    let _iva = 0;
    let _total = 0;
    for (let i = 0; i < this.cobranzaRetornoI.length; i++) {
      _subtotal = _subtotal + ((this.cobranzaRetornoI[i].amount * (this.cobranzaRetornoI[i].number_sign === 'positive' ? 1 : -1)));
    }
    _subtotal = parseFloat(Number(_subtotal).toFixed(2))
    if (this.rf.con_iva_retorno.value) {
      _iva = parseFloat(Number(_subtotal * this.iva).toFixed(2));
      _total = (_subtotal + _iva);
    } else {
      _total = (_subtotal);
    }


    // subtotal
    this.cobranzaRetornoI.push({
      element: 'subtotal',
      value: null,
      quantity: null,
      quantity_type: null,
      element_label: 'Subtotal',
      number_sign: 'positive',
      amount: _subtotal,
      currency: this.baseCurrency
    });
    this.rf.subtotal_retorno.patchValue(_subtotal);

    // iva
    if (this.rf.con_iva_retorno.value) {
      this.cobranzaRetornoI.push({
        element: 'iva',
        value: null,
        quantity: this.iva * 100,
        quantity_type: '%',
        element_label: 'IVA',
        number_sign: 'positive',
        amount: _iva,
        currency: this.baseCurrency
      });
      this.rf.con_iva_retorno.patchValue(true);
      this.rf.iva_retorno.patchValue(this.iva);
      this.rf.iva_monto_retorno.patchValue(_iva);
    }

    // total
    this.cobranzaRetornoI.push({
      element: 'total',
      value: null,
      quantity: null,
      quantity_type: null,
      element_label: 'Total',
      number_sign: 'positive',
      amount: _total,
      currency: this.baseCurrency
    });
    this.rf.total_retorno.patchValue(_total);
    this.rf.cobranza_calc_retorno.patchValue(this.cobranzaRetornoI);
    this.balanceRetornoPorPagar = _total;
  }

  async pushSelectedExtras() {
    let _ids = this.gf.cobros_extras_ids.value;
    this.gf.cobros_extras.setValue(null);
    let _extrasObj = []
    for (let i = 0; i < _ids.length; i++) {
      let _extra = this.tarifasExtras.find(x => x.id == _ids[i]);
      if (_extra) {
        _extrasObj.push(_extra);
      }
    }
    if (_extrasObj && _extrasObj.length > 0) {
      this.gf.cobros_extras.setValue(_extrasObj);
    }
    this.toastServ.presentToast('info','Revise la información de los cargos extra en especial la cantidad unitaria', 'top');
    await this.makeCalc();
  }

  async pushSelectedCargosExtras() {
    let _ids = this.rf.cargos_extras_retorno_ids.value;
    this.rf.cargos_extras_retorno.setValue(null);
    let _extrasObj = []
    for (let i = 0; i < _ids.length; i++) {
      let _extra = this.cargosExtras.find(x => x.id == _ids[i]);
      if (_extra) {
        _extrasObj.push(_extra);
      }
    }
    if (_extrasObj && _extrasObj.length > 0) {
      this.rf.cargos_extras_retorno.setValue(_extrasObj);
      this.cobranzaRetornoI = _extrasObj;
    } else {
      this.cobranzaRetornoI = [];
    }

    this.toastServ.presentToast('info','Revise la información de los cargos extra en especial la cantidad unitaria', 'top');
    this.makeCalcRetorno();
  }

  getExtraRows() {
    let elements = document.getElementsByClassName('extra-row');
    if (elements && elements.length > 0) {

      for (let i = 0; i < elements.length; i++) {
        if (i === 0) {
          elements[i].setAttribute('style', 'display:table-row');
        }
        if (i > 0) {
          elements[i].setAttribute('style', 'display:none');
        }
      }
    }
  }
  //#endregion

  //#region COBRANZAPROG FUNCTIONS
  async editCobro(tipo: CobranzaTipoE.PAGOTARJETA | CobranzaTipoE.PREAUTHORIZACION | CobranzaTipoE.PAGOEFECTIVO | CobranzaTipoE.PAGODEPOSITO, cobranza_seccion, cobro: CobranzaProgI) {
    if (tipo === CobranzaTipoE.PREAUTHORIZACION || tipo === CobranzaTipoE.PAGOTARJETA) {
      await this.agregarTarjetaForm(cobro.tipo, cobranza_seccion, cobro.tarjeta, true, cobro);
    }

    if (tipo === CobranzaTipoE.PAGOEFECTIVO) {
      await this.capturarCobroInput(cobro, cobranza_seccion, 'efectivo');
    }

    if (tipo === CobranzaTipoE.PAGODEPOSITO) {
      await this.capturaDeposito(cobranza_seccion)
    }
  }
  enableDisableEditCobro(cobro: CobranzaProgI, enable: boolean) {
    cobro.edit = enable;
  }
  cancelCobro(cobro: CobranzaProgI, cobranza_seccion) {
    this.sweetMsgServ.confirmRequest('¿Estás seguro de querer remover este elemento?', 'Esta acción no se puede revertir').then(async (data) => {
      if (data.value) {
        let _payload = {
          cobranza_id: cobro.id
        }
        let res = await this.cobranzaServ.cancelCobro(_payload);
        if (res.ok) {
          this.toastServ.presentToast('success', res.message, 'top');
          if (cobranza_seccion == 'salida') {
            let cobroIndex = this.cobranzaProgData.findIndex(x => x.id === cobro.id);
            this.cobranzaProgData.splice(cobroIndex, 1);
            this.recalBalancePorCobrar();
          } else {
            let cobroIndex = this.cobranzaProgRetornoData.findIndex(x => x.id === cobro.id);
            this.cobranzaProgRetornoData.splice(cobroIndex, 1);
            this.recalBalanceRetornoPorCobrar();
          }

        } else {
          this.sweetMsgServ.printStatusArray(res.errors.error.errors, 'error');
        }
      }
    })
  }

  updateSaveCobro(cobro: CobranzaProgI) {
    this.saveProcess('cobranza', null, cobro);
  }

  async updateTarjeta(cobro: CobranzaProgI, tipoCobro: number) {
    let _res = await this.agregarTarjetaForm(tipoCobro, cobro.tarjeta);
    if (_res) {
      cobro.tarjeta = _res;
    }
  }

  recalBalancePorCobrar() {
    let total = 0;
    this.balancePorPagar = this.generalDataForm.controls.total.value;
    let _data = this.cobranzaProgData.filter(x => x.tipo == 2 || x.tipo == 3);
    if (_data && _data.length > 0) {
      for (let i = 0; i < _data.length; i++) {
        total =  parseFloat(Number(Number(total) + Number(_data[i].monto)).toFixed(2));
      }
    }
    if ((total - this.balancePorPagar) > 50) {
      this.sweetMsgServ.printStatus('El monto aculamado de cobro es mayor al balance por cobrar', 'warning');
    }
    this.balancePorPagar = Number(Number(this.balancePorPagar -  total).toFixed(2));

    this.setTotalPago();
  }

  recalBalanceRetornoPorCobrar() {
    let total = 0;
    this.balanceRetornoPorPagar = this.retornoDataForm.controls.total_retorno.value;
    let _data = this.cobranzaProgRetornoData.filter(x => x.tipo == 2 || x.tipo == 3 || x.tipo == 4);
    if (_data && _data.length > 0) {
      for (let i = 0; i < _data.length; i++) {
        total =  parseFloat(Number(Number(total) + Number(_data[i].monto)).toFixed(2));
      }
    }
    if (this.balanceRetornoPorPagar < total) {
      this.sweetMsgServ.printStatus('El monto aculamado de cobro es mayor al balance por cobrar', 'warning');
    }
    this.balanceRetornoPorPagar = Number(this.balanceRetornoPorPagar -  total);

    this.setTotalRetornoPago();
  }

  setTotalRetornoPago() {
    this.pagadoRetornoAutTotal = 0;
    this.pagadoRetornoTotal = 0;
    let _dataPagado = this.cobranzaProgRetornoData.filter(x => x.tipo == CobranzaTipoE.PAGOTARJETA || x.tipo == CobranzaTipoE.PAGOEFECTIVO || x.tipo == CobranzaTipoE.PAGODEPOSITO);
    if (_dataPagado && _dataPagado.length > 0) {
      for (let i = 0; i < _dataPagado.length; i++) {
        this.pagadoRetornoTotal =  parseFloat(Number(Number(this.pagadoRetornoTotal) + Number(_dataPagado[i].monto)).toFixed(2));
      }
    }
    let _dataPreAutorizado = this.cobranzaProgRetornoData.filter(x => x.tipo == (CobranzaTipoE.PREAUTHORIZACION));
    if (_dataPreAutorizado && _dataPreAutorizado.length > 0) {
      for (let i = 0; i < _dataPreAutorizado.length; i++) {
        this.pagadoRetornoAutTotal =  parseFloat(Number(Number(this.pagadoRetornoAutTotal) + Number(_dataPreAutorizado[i].monto)).toFixed(2));
      }
    }
  }

  setTotalPago() {
    this.pagadoAutTotal = 0;
    this.pagadoTotal = 0;
    let _dataPagado = this.cobranzaProgData.filter(x => x.tipo == CobranzaTipoE.PAGOTARJETA || x.tipo == CobranzaTipoE.PAGOEFECTIVO);
    if (_dataPagado && _dataPagado.length > 0) {
      for (let i = 0; i < _dataPagado.length; i++) {
        this.pagadoTotal =  parseFloat(Number(Number(this.pagadoTotal) + Number(_dataPagado[i].monto)).toFixed(2));
      }
    }
    let _dataPreAutorizado = this.cobranzaProgData.filter(x => x.tipo == (CobranzaTipoE.PREAUTHORIZACION));
    if (_dataPreAutorizado && _dataPreAutorizado.length > 0) {
      for (let i = 0; i < _dataPreAutorizado.length; i++) {
        this.pagadoAutTotal =  parseFloat(Number(Number(this.pagadoAutTotal) + Number(_dataPreAutorizado[i].monto)).toFixed(2));
      }
    }
  }

  //#endregion

  saveAndGenerate(section: 'firma' | 'retorno') {
    if(section === 'firma' && !this.reviewVouchersCapture()) {
      return;
    }
    let mensaje: string = (section == 'firma') ? '¿Estás seguro de desea guardar el contrato?, ya que no podrá ser editable' : '¿Estás seguro de desea guardar las cargos extras al contrato?'
    this.sweetMsgServ.confirmRequest(mensaje).then(async (data) => {
      if (data.value) {
        this.saveProcess(section);
      }
    })
  }

  async saveProcess(section: 'datos_generales' | 'datos_cliente' | 'datos_vehiculo' | 'cobranza' | 'check_in_salida' | 'check_form_list' |  'firma' | 'retorno' | 'cobranza_retorno', ignoreMsg?: boolean, payload?, skipReload?: boolean) {
    //this.sweetMsgServ.printStatus('Acción en desarrollo', 'warning');
    if (!skipReload) {
      this.spinner.show();
    }

    let _payload;
    switch (section) {
      case 'datos_generales':
        if (this.generalDataForm.invalid) {
          this.spinner.hide();
          this.sweetMsgServ.printStatus('Verifica que los datos solicitados esten completos', 'warning');
          this.generalDataForm.markAllAsTouched();
          console.log('invalid form --->', this.generalDataForm.controls)
          return;
        }
        _payload = this.generalDataForm.value;
        if (moment.isMoment(_payload.rango_fechas.fecha_salida)) {
          _payload.rango_fechas.fecha_salida = DateConv.transFormDate(_payload.rango_fechas.fecha_salida, 'regular');
        }
        if (moment.isMoment(_payload.rango_fechas.fecha_retorno)) {
          _payload.rango_fechas.fecha_retorno = DateConv.transFormDate(_payload.rango_fechas.fecha_retorno, 'regular');
        }

        //_payload.hora_elaboracion = DateConv.transFormDate(moment.now(), 'time');
        break;
      case 'datos_vehiculo':
        if (this.vehiculoForm.invalid) {
          this.spinner.hide();
          this.sweetMsgServ.printStatus('Verifica que los datos solicitados esten completos', 'warning');
          this.vehiculoForm.markAllAsTouched();
          return;
        }

        this.vehiculoForm.enable();
        _payload = this.vehiculoForm.value;
        this.checkVehiculoFormDisableFields();
        break;
      case 'datos_cliente':
        if (this.clienteDataForm.invalid) {
          this.spinner.hide();
          if (!ignoreMsg) {
            this.sweetMsgServ.printStatus('Verifica que los datos solicitados esten completos', 'warning');
          }

          this.clienteDataForm.markAllAsTouched();
          return;
        } else if (this.docsClientComponent.docData_docs.length === 0) {
          this.spinner.hide();
          this.sweetMsgServ.printStatus('Es necesesario adjuntar la licencia del cliente', 'warning');
          return;
        }

        _payload = this.clienteDataForm.value;
        break;
      case 'cobranza':
        if (!payload) {
          this.spinner.hide();
          this.sweetMsgServ.printStatus('Verifica que los datos solicitados esten completos', 'warning');
          return;
        }
        if (payload.tarjeta) {
          delete payload.tarjeta;
        }

        _payload = payload;
        //_payload.cobranza_id = payload.id;
        break;
      case 'check_in_salida':
        if (this.dragObjs.length === 0) {
          this.spinner.hide();
          this.sweetMsgServ.printStatus('Agrega un elemento de verificación', 'warning');
          return;
        }

        _payload = payload
        break;
      case 'check_form_list':
        if (this.dragObjs.length === 0) {
          this.spinner.hide();
          this.sweetMsgServ.printStatus('Agrega un elemento de verificación', 'warning');
          return;
        }

        this.saveCheckListDB(true);

        if (this.checkListForm.invalid) {
          this.checkListForm.markAllAsTouched();
          return;
        }

        let canvas = await html2canvas(document.querySelector("#check-list-canvas"), { logging: true, allowTaint: false , useCORS: true });

        let check_img = canvas.toDataURL();
        this.check_list_img = check_img;


        _payload = this.checkListForm.value
        _payload.contrato_id = this.contract_id
        _payload.check_list_img  = this.check_list_img;
        break;
      case 'firma':

        if (this.signature == '') {
          this.spinner.hide();
          this.sweetMsgServ.printStatus('Es necesesario la firma para terminar el proceso', 'warning');
          return;
        }
        _payload = this.signature
        break;
      case 'retorno':
        if (this.retornoDataForm.invalid) {
          this.spinner.hide();
          this.sweetMsgServ.printStatus('Verifica que los datos solicitados esten completos', 'warning');
          return;
        }
        _payload = this.retornoDataForm.value;
        break;
      case 'cobranza_retorno':
          if (!payload) {
            this.spinner.hide();
            this.sweetMsgServ.printStatus('Verifica que los datos solicitados esten completos', 'warning');
            return;
          }
          if (payload.tarjeta) {
            delete payload.tarjeta;
          }

          _payload = payload;
          //_payload.cobranza_id = payload.id;
        break;
    }

    if (this.isReserva) {
      _payload.reserva = true;
    }
    _payload.seccion = section;
    _payload.num_contrato = this.num_contrato;

    //return;


    this.contratosServ.saveProgress(_payload).subscribe(async res => {
      this.spinner.hide();
      if (res.ok) {

        this.contract_id = res.id;
        this.num_contrato = res.contract_number;
        this.contratosServ.setContractData(this.num_contrato);
        this.contractTypePrefix = this.contratosServ.getContractTypePrefix(this.contratosServ.getContractNumber());

        if (section === 'datos_cliente' && res.cliente_id) {
          if (this.docsClientComponent.docData_docs.length > 0) {
            this.docsClientComponent.model_id_value = res.cliente_id;
            const docsClientSaved = await this.docsClientComponent.uploadArrayDatasImg('licencia_conducir', 'clientes', res.cliente_id);
            console.log('docsClientSaved', docsClientSaved)
            if (!docsClientSaved) {
              return;
            }
            this.step++;
          }
        }

        if (section === 'check_in_salida') {
          localStorage.removeItem(this.generalServ.dragObjStorageKey);
          this.selectedDragObj = null;

          if (res.check_list_salida) {
            this.fetchDragObjsFromApi(res.check_list_salida);
          }
        }
        if (!skipReload) {
          this.sweetMsgServ.printStatus(res.message, 'success');
        }

        if (section === 'cobranza' || section == 'check_in_salida') {
          this.step = this.step;
        } else {
          this.step++;
        }

        if (section == 'firma' && res.status === ContratosStatusE.RENTADO) {
          setTimeout(async () => {
            await this.sendAndGeneratePDF();
            this.contratosServ.flushContractData();
            this.router.navigateByUrl('vehiculos/list');
          }, 1000);
          return;
        }

        if (section === 'retorno') {
          if(this.balanceRetornoPorPagar == 0) {
            await this.viewPDF();
            this.contratosServ.flushContractData();
            this.router.navigateByUrl('vehiculos/list');
          }
        }
        if (!skipReload) {
          await this.reloadAll();
        }
      }
    }, error => {
      this.spinner.hide();
      console.log(error);
      this.sweetMsgServ.printStatusArray(error.error.errors, 'error');
    })
  }

  async sendAndGeneratePDF() {
    if (this.isReserva) {
      this.sendAndGeneratePDFReserva();
      return;
    }

    this.spinner.show();
    this.contratosServ.sendAndGeneratePDF(this.contract_id).subscribe(res => {
      const url = URL.createObjectURL(res);
      this.spinner.hide();
      if (this.detectIOS() === true) {
        window.location.assign(url);
      } else {
        window.open(url, '_blank');
      }
    }, error => {
      this.spinner.hide();
      const fr = new FileReader();
      fr.addEventListener('loadend', (e: any) => {
        const errors = JSON.parse(e.srcElement.result);
        this.sweetMsgServ.printStatusArray(errors.errors, 'error');
      });
      fr.readAsText(error.error);
    });
  }

  async sendAndGeneratePDFReserva() {
    this.spinner.show();

    let sendPDFToClient = false;
    let msgResponse = await this.sweetMsgServ.confirmRequest('¿Quieres enviar una copia del la reserva en PDF al cliente?', ' ');
    if (msgResponse.value) {
      sendPDFToClient = true;
    }
    this.contratosServ.sendAndGenerateReservaPDF(this.contract_id, this.idioma, sendPDFToClient).subscribe(res => {
      const url = URL.createObjectURL(res);
      this.contratosServ.flushReservaData();
      this.contratosServ.flushContractData();

      this.spinner.hide();
      if (this.detectIOS() === true) {
        window.location.assign(url);
      } else {
        window.open(url, '_blank');
      }

      this.dismiss(true);
    }, error => {
      this.spinner.hide();
      const fr = new FileReader();
      fr.addEventListener('loadend', (e: any) => {
        const errors = JSON.parse(e.srcElement.result);
        this.sweetMsgServ.printStatusArray(errors.errors, 'error');
      });
      fr.readAsText(error.error);
    });
  }

  reviewVouchersCapture(): boolean {
    let docsVoucherTarejetaSalida = this.docsVoucherCobrosTarjetaSalida.toArray();
    let docsVoucherAuthSalida = this.docsVoucherCobrosAuth.toArray();

    if (docsVoucherTarejetaSalida && docsVoucherTarejetaSalida.length > 0) {
      let passVoucherSalida = false
      console.log('docsVoucherSalida', docsVoucherTarejetaSalida);
      for (let voucher of docsVoucherTarejetaSalida) {
        passVoucherSalida = voucher.docData_docs.some((v) => v.success)
      }
      if(!passVoucherSalida) {
        this.sweetMsgServ.printStatus('Recuerda adjuntar el voucher de la transacción del cobró de cada tarjeta', 'error');
        return passVoucherSalida
      }
    }
    if (docsVoucherAuthSalida && docsVoucherAuthSalida.length > 0) {
      let passVoucherAuthSalida = false
      for (let voucher of docsVoucherAuthSalida) {
        passVoucherAuthSalida = voucher.docData_docs.some((v) => v.success)
      }
      console.log('docsVoucherAuthSalida', docsVoucherAuthSalida);
      if (!passVoucherAuthSalida) {
        this.sweetMsgServ.printStatus('Recuerda adjuntar el voucher de la transacción del cobró de pre-autorización de cada tarjeta', 'error');
        return passVoucherAuthSalida
      }
    }

    return true
  }

  dismiss(reload?) {
    this.modalCtrl.dismiss({
      reload
    });
  }

  async finalizarRetorno() {
    await this.viewPDF();
    this.contratosServ.flushContractData();
    this.router.navigateByUrl('vehiculos/list');
  }


  async viewPDF() {
    this.spinner.show();
    this.contratosServ.viewPDF(this.contract_id, null).subscribe(res => {
      const url = URL.createObjectURL(res);
      this.spinner.hide();
      if (this.detectIOS() === true) {
        window.location.assign(url);
      } else {
        window.open(url, '_blank');
      }

    }, error => {
      this.spinner.hide();
      const fr = new FileReader();
      fr.addEventListener('loadend', (e: any) => {
        const errors = JSON.parse(e.srcElement.result);
        this.sweetMsgServ.printStatusArray(errors.errors, 'error');
      });
      fr.readAsText(error.error);
    });
  }

  cancelContract() {
    this.sweetMsgServ.confirmRequest('¿Estas seguro de querer cancelar este contrato?').then((data) => {
      if (data.value) {
       this.contratosServ.cancelContract(this.contract_id).subscribe(res => {
         if (res.ok) {
           this.sweetMsgServ.printStatus(res.message, 'success');
           this.contratosServ.flushContractData();
           localStorage.removeItem(this.generalServ.dragObjStorageKey);
           setTimeout(() => {
             window.location.reload();
           }, 1000);

         }
       }, error => {
        this.spinner.hide();
         console.log(error);
         this.sweetMsgServ.printStatusArray(error.error.errors, 'error');
       })
      }
    });
  }

  ionViewWillLeave() {
    this.resetAll();
  }
  resetAll() {
    this.initGeneralForm();
    this.initClientForm();
    this.initVehiculoForm();
    this.initCheckListForm();
    this.initRetornoForm();

    this.contractData = null;
    this.step = 0;
    this.vehiculoData = null;
    this.cobranzaProgData = [];
    this.dragObjs = [];
    this.terminos = null;
    this.signature_matrix = null;
    this.signature = null;
    this.num_contrato = null;
  }

}

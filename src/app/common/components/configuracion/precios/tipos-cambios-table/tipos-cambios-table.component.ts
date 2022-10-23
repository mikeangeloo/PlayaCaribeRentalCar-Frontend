import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {CargosExtraI} from '../../../../../interfaces/configuracion/cargos-extras.interface';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {GeneralService} from '../../../../../services/general.service';
import {ActionSheetController, ModalController, NavController} from '@ionic/angular';
import {SweetMessagesService} from '../../../../../services/sweet-messages.service';
import {ToastMessageService} from '../../../../../services/toast-message.service';
import * as moment from 'moment';
import {TxtConv} from '../../../../../helpers/txt-conv';
import {ConversionMonedaService} from '../../../../../services/conversion-moneda.service';
import {TipoCambioFormComponent} from '../tipo-cambio-form/tipo-cambio-form.component';

@Component({
  selector: 'app-tipos-cambios-table',
  templateUrl: './tipos-cambios-table.component.html',
  styleUrls: ['./tipos-cambios-table.component.scss'],
})
export class TiposCambiosTableComponent implements OnInit {

  public spinner = false;
  public editTipoCambio: CargosExtraI;
  @Input() public tiposCambio: CargosExtraI[] = [];
  @Input() isModal: boolean;
  @Output() emitData = new EventEmitter();
  displayedColumns: string[] = [
    'id',
    'divisa_base',
    'tipo_cambio',
    'divisa_conversion',
    'created_by',
    'created_at',
    'acciones'
  ];
  listTiposCambio: MatTableDataSource<any>;
  public searchKey: string;
  @ViewChild(MatPaginator, {static: false}) paginator3: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    public generalService: GeneralService,
    public modalCtr: ModalController,
    public navigateCtrl: NavController,
    public actionSheetController: ActionSheetController,
    public sweetServ: SweetMessagesService,
    public toastServ: ToastMessageService,
    public conversionMonedaServ: ConversionMonedaService,
  ) { }


  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    console.log('cahnge');
    const tiposCambioChange = changes.tiposCambio;
    if (tiposCambioChange.isFirstChange() === true || tiposCambioChange.firstChange === false) {
      if (this.tiposCambio) {
        this.loadTiposCambioTable(this.tiposCambio);
      } else {
        this.loadTiposCambioTable();
      }
    }
  }

  initTiposCambio() {
    const currDate = moment().format('YYYY-MM-DD');
    this.editTipoCambio = {
      id: 0,
    };
  }

  // Método para cargar datos de los campus
  loadTiposCambioTable(_data?: CargosExtraI[]) {
    console.log('ready');
    //this.listado-hoteles = null;
    this.listTiposCambio = null;
    this.initTiposCambio();
    this.spinner = true;

    if (_data) {
      this.tiposCambio = _data;
      this.spinner = false;
      this.listTiposCambio = new MatTableDataSource(_data);
      this.listTiposCambio.sort = this.sort;
      this.listTiposCambio.paginator = this.paginator3;
    } else {
      this.conversionMonedaServ.getAllHistory().subscribe(response => {
        if (response.ok === true) {
          this.spinner = false;
          this.listTiposCambio = new MatTableDataSource(response.data);
          this.listTiposCambio.sort = this.sort;
          this.listTiposCambio.paginator = this.paginator3;
          this.tiposCambio = response.data;
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
    this.listTiposCambio.filter = TxtConv.txtCon(searchValue, 'lowercase');
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

  catchSelectedRow(_data: CargosExtraI) {
    this.editTipoCambio = _data;
  }
  // Método para editar survey
  async openTipoCambioForm(_data?: CargosExtraI) {
    if (_data) {
      this.editTipoCambio = _data;
    } else {
      this.initTiposCambio();
    }
    //this.generalService.presentLoading();
    const modal = await this.modalCtr.create({
      component: TipoCambioFormComponent,
      componentProps: {
        'asModal': true,
        'tipo_cambio_id': (_data && _data.id) ? _data.id : null
      },
      swipeToClose: true,
      cssClass: 'edit-form'
    });
    await modal.present();
    const {data} = await modal.onWillDismiss();
    if (data.reload && data.reload === true) {
      this.loadTiposCambioTable();
    }
  }

  deleteTipoCambio(id) {
    this.sweetServ.confirmDelete().then((data) => {
      if (data.value) {
        this.conversionMonedaServ.deleteTipoCambio(id).subscribe(res => {
          if (res.ok) {
            this.sweetServ.printStatus(res.message, 'success');
            this.loadTiposCambioTable()
            this.conversionMonedaServ.loadTiposCambios();
          }
        })
      }
    }, errors => {
      console.log(errors);
      this.sweetServ.printStatusArray(errors.error.errors, 'error');
    })
  }

}

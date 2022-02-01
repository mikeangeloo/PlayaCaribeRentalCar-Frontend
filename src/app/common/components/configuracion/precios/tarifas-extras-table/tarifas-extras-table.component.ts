import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {ClasesVehiculosI} from '../../../../../interfaces/catalogo-vehiculos/clases-vehiculos.interface';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {GeneralService} from '../../../../../services/general.service';
import {ClasesVehiculosService} from '../../../../../services/clases-vehiculos.service';
import {ActionSheetController, ModalController, NavController} from '@ionic/angular';
import {SweetMessagesService} from '../../../../../services/sweet-messages.service';
import {ToastMessageService} from '../../../../../services/toast-message.service';
import * as moment from 'moment';
import {TxtConv} from '../../../../../helpers/txt-conv';
import {TarifasExtrasI} from '../../../../../interfaces/configuracion/tarifas-extras.interface';
import {TarifasExtrasService} from '../../../../../services/tarifas-extras.service';
import {TarifasExtrasFormComponent} from '../tarifas-extras-form/tarifas-extras-form.component';

@Component({
  selector: 'app-tarifas-extras-table',
  templateUrl: './tarifas-extras-table.component.html',
  styleUrls: ['./tarifas-extras-table.component.scss'],
})
export class TarifasExtrasTableComponent implements OnInit, OnChanges {

  public spinner = false;
  public editTarifasExtras: TarifasExtrasI;
  @Input() public tarifasExtras: TarifasExtrasI[] = [];
  @Input() isModal: boolean;
  @Output() emitData = new EventEmitter();
  displayedColumns: string[] = [
    'id',
    'nombre',
    'precio',
    'activo',
    'created_at',
    'acciones'
  ];
  listTarifasExtras: MatTableDataSource<any>;
  public searchKey: string;
  @ViewChild(MatPaginator, {static: false}) paginator3: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;



  constructor(
      public generalService: GeneralService,
      public tarifasExtrasServ: TarifasExtrasService,
      public modalCtr: ModalController,
      public navigateCtrl: NavController,
      public actionSheetController: ActionSheetController,
      public sweetServ: SweetMessagesService,
      public toastServ: ToastMessageService
  ) {
    this.initTarifasExtras();
  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('cahnge');
    const modelosChange = changes.tarifasExtras;
    if (modelosChange.isFirstChange() === true || modelosChange.firstChange === false) {
      if (this.tarifasExtras) {
        this.loadTarifasExtrasTable(this.tarifasExtras);
      } else {
        this.loadTarifasExtrasTable();
      }
    }
  }

  initTarifasExtras() {
    const currDate = moment().format('YYYY-MM-DD');
    this.editTarifasExtras = {
      id: 0,
    };
  }

  // Método para cargar datos de los campus
  loadTarifasExtrasTable(_data?: TarifasExtrasI[]) {
    console.log('ready');
    //this.listado-empresas = null;
    this.listTarifasExtras = null;
    this.initTarifasExtras();
    this.spinner = true;

    if (_data) {
      this.tarifasExtras = _data;
      this.spinner = false;
      this.listTarifasExtras = new MatTableDataSource(_data);
      this.listTarifasExtras.sort = this.sort;
      this.listTarifasExtras.paginator = this.paginator3;
    } else {
      this.tarifasExtrasServ.getAll().subscribe(response => {
        if (response.ok === true) {
          this.spinner = false;
          this.listTarifasExtras = new MatTableDataSource(response.datas);
          this.listTarifasExtras.sort = this.sort;
          this.listTarifasExtras.paginator = this.paginator3;
          this.tarifasExtras = response.datas;
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
    this.listTarifasExtras.filter = TxtConv.txtCon(searchValue, 'lowercase');
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

  catchSelectedRow(_data: TarifasExtrasI) {
    this.editTarifasExtras = _data;
  }
  // Método para editar survey
  async openTarifasExtrasForm(_data?: TarifasExtrasI) {
    if (_data) {
      this.editTarifasExtras = _data;
    } else {
      this.initTarifasExtras();
    }
    //this.generalService.presentLoading();
    const modal = await this.modalCtr.create({
      component: TarifasExtrasFormComponent,
      componentProps: {
        'asModal': true,
        'tarifa_extra_id': (_data && _data.id) ? _data.id : null
      },
      swipeToClose: true,
      cssClass: 'edit-form'
    });
    await modal.present();
    const {data} = await modal.onWillDismiss();
    if (data.reload && data.reload === true) {
      this.loadTarifasExtrasTable();
    }
  }

  inactiveTarifaExtra(_data: TarifasExtrasI) {
    this.sweetServ.confirmRequest('¿Estás seguro de querer deshabilitar este registro ?').then((data) => {
      if (data.value) {
        this.tarifasExtrasServ.setInactive(_data.id).subscribe(res => {
          if (res.ok === true) {
            this.toastServ.presentToast('success', res.message, 'top');
            this.loadTarifasExtrasTable();
          }
        }, error => {
          console.log(error);
          this.sweetServ.printStatusArray(error.error.errors, 'error');
        });
      }
    });
  }

  activeTarifaExtra(_data: TarifasExtrasI) {
    this.sweetServ.confirmRequest('¿Estás seguro de querer habilitar este registro ?').then((data) => {
      if (data.value) {
        this.tarifasExtrasServ.setEnable(_data.id).subscribe(res => {
          if (res.ok === true) {
            this.toastServ.presentToast('success', res.message, 'top');
            this.loadTarifasExtrasTable();
          }
        }, error => {
          console.log(error);
          this.sweetServ.printStatusArray(error.error.errors, 'error');
        });
      }
    });
  }

}

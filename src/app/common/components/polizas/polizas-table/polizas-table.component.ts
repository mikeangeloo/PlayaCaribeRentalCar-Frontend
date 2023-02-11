import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {GeneralService} from '../../../../services/general.service';
import {ActionSheetController, ModalController, NavController} from '@ionic/angular';
import {SweetMessagesService} from '../../../../services/sweet-messages.service';
import {ToastMessageService} from '../../../../services/toast-message.service';
import * as moment from 'moment';
import {TxtConv} from '../../../../helpers/txt-conv';
import {PolizasI} from '../../../../interfaces/polizas/polizas.interface';
import {PolizasService} from '../../../../services/polizas.service';
import {PolizaFormComponent} from '../poliza-form/poliza-form.component';

@Component({
  selector: 'app-polizas-table',
  templateUrl: './polizas-table.component.html',
  styleUrls: ['./polizas-table.component.scss'],
})
export class PolizasTableComponent implements OnInit {

  public spinner = false;
  public editPolizas: PolizasI;
  @Input() public polizas: PolizasI[] = [];
  @Input() isModal: boolean;
  @Output() emitData = new EventEmitter();
  displayedColumns: string[] = [
    'id',
    'aseguradora',
    'no_poliza',
    'tipo_poliza',
    'tel_contacto',
    'titular',
    'fecha_inicio',
    'fecha_fin',
    'created_at',
    'acciones'
  ];
  listPolizas: MatTableDataSource<any>;
  public searchKey: string;
  @ViewChild(MatPaginator, {static: false}) paginator3: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  constructor(
    public generalService: GeneralService,
    public polizasServ: PolizasService,
    public modalCtr: ModalController,
    public navigateCtrl: NavController,
    public actionSheetController: ActionSheetController,
    public sweetServ: SweetMessagesService,
    public toastServ: ToastMessageService
  ) {
    this.initPolizas();
  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('cahnge');
    const polizaChange = changes.polizas;
    if (polizaChange.isFirstChange() === true || polizaChange.firstChange === false) {
      if (this.polizas) {
        this.loadPolizasTable(this.polizas);
      } else {
        this.loadPolizasTable();
      }
    }
  }

  initPolizas() {
    const currDate = moment().format('YYYY-MM-DD');
    this.editPolizas = {
      id: 0,
    };
  }

  // Método para cargar datos
  loadPolizasTable(_data?: PolizasI[]) {
    console.log('ready');
    //this.listado-hoteles = null;
    this.listPolizas = null;
    this.initPolizas();
    this.spinner = true;

    if (_data) {
      this.polizas = _data;
      this.spinner = false;
      this.listPolizas = new MatTableDataSource(_data);
      this.listPolizas.sort = this.sort;
      this.listPolizas.paginator = this.paginator3;
    } else {
      this.polizasServ.getAll().subscribe(response => {
        if (response.ok === true) {
          this.spinner = false;
          this.listPolizas = new MatTableDataSource(response.data);
          this.listPolizas.sort = this.sort;
          this.listPolizas.paginator = this.paginator3;
          this.polizas = response.data;
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
    this.listPolizas.filter = TxtConv.txtCon(searchValue, 'lowercase');
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

  catchSelectedRow(_data: PolizasI) {
    this.editPolizas = _data;
  }
  // Método para editar survey
  async openPolizasForm(_data?: PolizasI) {
    if (_data) {
      this.editPolizas = _data;
    } else {
      this.initPolizas();
    }
    //this.generalService.presentLoading();
    const modal = await this.modalCtr.create({
      component: PolizaFormComponent,
      componentProps: {
        'asModal': true,
        'poliza_id': (_data && _data.id) ? _data.id : null
      },
      swipeToClose: true,
      cssClass: 'edit-form'
    });
    await modal.present();
    const {data} = await modal.onWillDismiss();
    if (data.reload && data.reload === true) {
      this.loadPolizasTable();
    }
  }

  inactivePoliza(_data: PolizasI) {
    this.sweetServ.confirmRequest('¿Estás seguro de querer deshabilitar este registro ?').then((data) => {
      if (data.value) {
        this.polizasServ.setInactive(_data.id).subscribe(res => {
          if (res.ok === true) {
            this.toastServ.presentToast('success', res.message, 'top');
            this.loadPolizasTable();
          }
        }, error => {
          console.log(error);
          this.sweetServ.printStatusArray(error.error.errors, 'error');
        });
      }
    });
  }

  activeTarifaExtra(_data: PolizasI) {
    this.sweetServ.confirmRequest('¿Estás seguro de querer habilitar este registro ?').then((data) => {
      if (data.value) {
        this.polizasServ.setEnable(_data.id).subscribe(res => {
          if (res.ok === true) {
            this.toastServ.presentToast('success', res.message, 'top');
            this.loadPolizasTable();
          }
        }, error => {
          console.log(error);
          this.sweetServ.printStatusArray(error.error.errors, 'error');
        });
      }
    });
  }

}

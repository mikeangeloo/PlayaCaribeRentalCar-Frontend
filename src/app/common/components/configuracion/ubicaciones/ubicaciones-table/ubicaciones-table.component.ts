import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {GeneralService} from '../../../../../services/general.service';
import {ActionSheetController, ModalController, NavController} from '@ionic/angular';
import {SweetMessagesService} from '../../../../../services/sweet-messages.service';
import {ToastMessageService} from '../../../../../services/toast-message.service';
import * as moment from 'moment';
import {TxtConv} from '../../../../../helpers/txt-conv';
import {UbicacionesI} from '../../../../../interfaces/configuracion/ubicaciones.interface';
import {UbicacionesService} from '../../../../../services/ubicaciones.service';
import {UbicacionesFormComponent} from '../ubicaciones-form/ubicaciones-form.component';

@Component({
  selector: 'app-ubicaciones-table',
  templateUrl: './ubicaciones-table.component.html',
  styleUrls: ['./ubicaciones-table.component.scss'],
})
export class UbicacionesTableComponent implements OnInit {

  public spinner = false;
  public editUbicaciones: UbicacionesI;
  @Input() public ubicaciones: UbicacionesI[] = [];
  @Input() isModal: boolean;
  @Output() emitData = new EventEmitter();
  displayedColumns: string[] = [
    'id',
    'alias',
    'pais',
    'estado',
    'municipio',
    'colonia',
    'direccion',
    'activo',
    'acciones'
  ];
  listUbicaciones: MatTableDataSource<any>;
  public searchKey: string;
  @ViewChild(MatPaginator, {static: false}) paginator3: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;



  constructor(
      public generalService: GeneralService,
      public ubicacionesServ: UbicacionesService,
      public modalCtr: ModalController,
      public navigateCtrl: NavController,
      public actionSheetController: ActionSheetController,
      public sweetServ: SweetMessagesService,
      public toastServ: ToastMessageService
  ) {
    this.initUbicaciones();
  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    const modelosChange = changes.ubicaciones;
    if (modelosChange.isFirstChange() === true || modelosChange.firstChange === false) {
      if (this.ubicaciones) {
        this.loadUbicacionesTable(this.ubicaciones);
      } else {
        this.loadUbicacionesTable();
      }
    }
  }

  initUbicaciones() {
    const currDate = moment().format('YYYY-MM-DD');
    this.editUbicaciones = {
      id: 0,
    };
  }

  // Método para cargar datos de los campus
  loadUbicacionesTable(_data?: UbicacionesI[]) {
    console.log('ready');
    //this.listado-hoteles = null;
    this.listUbicaciones = null;
    this.initUbicaciones();
    this.spinner = true;

    if (_data) {
      this.ubicaciones = _data;
      this.spinner = false;
      this.listUbicaciones = new MatTableDataSource(_data);
      this.listUbicaciones.sort = this.sort;
      this.listUbicaciones.paginator = this.paginator3;
    } else {
      this.ubicacionesServ.getAll().subscribe(response => {
        if (response.ok === true) {
          this.spinner = false;
          this.listUbicaciones = new MatTableDataSource(response.datas);
          this.listUbicaciones.sort = this.sort;
          this.listUbicaciones.paginator = this.paginator3;
          this.ubicaciones = response.datas;
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
    this.listUbicaciones.filter = TxtConv.txtCon(searchValue, 'lowercase');
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

  catchSelectedRow(_data: UbicacionesI) {
    this.editUbicaciones = _data;
  }
  // Método para editar survey
  async openUbicacionesForm(_data?: UbicacionesI) {
    if (_data) {
      this.editUbicaciones = _data;
    } else {
      this.initUbicaciones();
    }
    //this.generalService.presentLoading();
    const modal = await this.modalCtr.create({
      component: UbicacionesFormComponent,
      componentProps: {
        'asModal': true,
        'ubicacion_id': (_data && _data.id) ? _data.id : null
      },
      swipeToClose: true,
      cssClass: 'edit-form'
    });
    await modal.present();
    const {data} = await modal.onWillDismiss();
    if (data.reload && data.reload === true) {
      this.loadUbicacionesTable();
    }
  }

  inactiveUbicacion(_data: UbicacionesI) {
    this.sweetServ.confirmRequest('¿Estás seguro de querer deshabilitar este registro ?').then((data) => {
      if (data.value) {
        this.ubicacionesServ.setInactive(_data.id).subscribe(res => {
          if (res.ok === true) {
            this.toastServ.presentToast('success', res.message, 'top');
            this.loadUbicacionesTable();
          }
        }, error => {
          console.log(error);
          this.sweetServ.printStatusArray(error.error.errors, 'error');
        });
      }
    });
  }

  activeUbicacion(_data: UbicacionesI) {
    this.sweetServ.confirmRequest('¿Estás seguro de querer habilitar este registro ?').then((data) => {
      if (data.value) {
        this.ubicacionesServ.setEnable(_data.id).subscribe(res => {
          if (res.ok === true) {
            this.toastServ.presentToast('success', res.message, 'top');
            this.loadUbicacionesTable();
          }
        }, error => {
          console.log(error);
          this.sweetServ.printStatusArray(error.error.errors, 'error');
        });
      }
    });
  }

}

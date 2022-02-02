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
import {ClasesVehiculosI} from '../../../../interfaces/catalogo-vehiculos/clases-vehiculos.interface';
import {ClasesVehiculosService} from '../../../../services/clases-vehiculos.service';
import {ClaseVehiculoFormComponent} from '../clase-vehiculo-form/clase-vehiculo-form.component';

@Component({
  selector: 'app-clases-vehiculos-table',
  templateUrl: './clases-vehiculos-table.component.html',
  styleUrls: ['./clases-vehiculos-table.component.scss'],
})
export class ClasesVehiculosTableComponent implements OnInit {

  public spinner = false;
  public editClasesVehiculos: ClasesVehiculosI;
  @Input() public clasesVehiculos: ClasesVehiculosI[] = [];
  @Input() isModal: boolean;
  @Output() emitData = new EventEmitter();
  displayedColumns: string[] = [
    'id',
    'clase',
    'activo',
    'created_at',
    'acciones'
  ];
  listClasVehiculos: MatTableDataSource<any>;
  public searchKey: string;
  @ViewChild(MatPaginator, {static: false}) paginator3: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;



  constructor(
      public generalService: GeneralService,
      public classVehiculoServ: ClasesVehiculosService,
      public modalCtr: ModalController,
      public navigateCtrl: NavController,
      public actionSheetController: ActionSheetController,
      public sweetServ: SweetMessagesService,
      public toastServ: ToastMessageService
  ) {
    //this.loadSurveysTable();
    this.initClassVehiculos();
  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    const modelosChange = changes.clasesVehiculos;
    if (modelosChange.isFirstChange() === true || modelosChange.firstChange === false) {
      if (this.clasesVehiculos) {
        this.loadClasesVehiculosTable(this.clasesVehiculos);
      } else {
        this.loadClasesVehiculosTable();
      }
    }
  }

  initClassVehiculos() {
    const currDate = moment().format('YYYY-MM-DD');
    this.editClasesVehiculos = {
      id: 0,
    };
  }

  // Método para cargar datos de los campus
  loadClasesVehiculosTable(_data?: ClasesVehiculosI[]) {
    //this.listado-hoteles = null;
    this.listClasVehiculos = null;
    this.initClassVehiculos();
    this.spinner = true;

    if (_data) {
      this.clasesVehiculos = _data;
      this.spinner = false;
      this.listClasVehiculos = new MatTableDataSource(_data);
      this.listClasVehiculos.sort = this.sort;
      this.listClasVehiculos.paginator = this.paginator3;
    } else {
      this.classVehiculoServ.getAll().subscribe(response => {
        if (response.ok === true) {
          this.spinner = false;
          this.listClasVehiculos = new MatTableDataSource(response.datas);
          this.listClasVehiculos.sort = this.sort;
          this.listClasVehiculos.paginator = this.paginator3;
          this.clasesVehiculos = response.datas;
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
    this.listClasVehiculos.filter = TxtConv.txtCon(searchValue, 'lowercase');
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

  catchSelectedRow(_data: ClasesVehiculosI) {
    this.editClasesVehiculos = _data;
  }
  // Método para editar survey
  async openClassVehiculoForm(_data?: ClasesVehiculosI) {
    if (_data) {
      this.editClasesVehiculos = _data;
    } else {
      this.initClassVehiculos();
    }
    //this.generalService.presentLoading();
    const modal = await this.modalCtr.create({
      component: ClaseVehiculoFormComponent,
      componentProps: {
        'asModal': true,
        'clase_vehiculo_id': (_data && _data.id) ? _data.id : null
      },
      swipeToClose: true,
      cssClass: 'edit-form'
    });
    await modal.present();
    const {data} = await modal.onWillDismiss();
    if (data.reload && data.reload === true) {
      this.loadClasesVehiculosTable();
    }
  }

  inactiveClaseVehiculo(_data: ClasesVehiculosI) {
    this.sweetServ.confirmRequest('¿Estás seguro de querer deshabilitar este registro ?').then((data) => {
      if (data.value) {
        this.classVehiculoServ.setInactive(_data.id).subscribe(res => {
          if (res.ok === true) {
            this.toastServ.presentToast('success', res.message, 'top');
            this.loadClasesVehiculosTable();
          }
        }, error => {
          console.log(error);
          this.sweetServ.printStatusArray(error.error.errors, 'error');
        });
      }
    });
  }

  activeClaseVehiculo(_data: ClasesVehiculosI) {
    this.sweetServ.confirmRequest('¿Estás seguro de querer habilitar este registro ?').then((data) => {
      if (data.value) {
        this.classVehiculoServ.setEnable(_data.id).subscribe(res => {
          if (res.ok === true) {
            this.toastServ.presentToast('success', res.message, 'top');
            this.loadClasesVehiculosTable();
          }
        }, error => {
          console.log(error);
          this.sweetServ.printStatusArray(error.error.errors, 'error');
        });
      }
    });
  }

}

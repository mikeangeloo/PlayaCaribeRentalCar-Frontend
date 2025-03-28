import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
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
import { VehiculosEstatusFormComponent } from '../vehiculos-estatus-form/vehiculos-estatus-form.component';
import {VehiculosStatusE} from '../../../../enums/vehiculos-status.enum';

@Component({
  selector: 'app-vehiculos-list',
  templateUrl: './vehiculos-list.component.html',
  styleUrls: ['./vehiculos-list.component.scss'],
})
export class VehiculosListComponent implements OnInit, OnChanges {
  public spinner = false;
  public editVehiculo: VehiculosI;
  @Input() public vehiculos: VehiculosI[] = [];
  @Input() isModal: boolean;
  @Output() emitData = new EventEmitter();
  public vehiculoC = VehiculosC;
  public vehiculosE = VehiculosStatusE;
  displayedColumns: string[] = [
    'codigo',
    'estatus',
    'modelo',
    'marca',
    'modelo_ano',
    'categoria',
    'tarifa_categoria',
    'placas',
    'version',
    'activo',
    'created_at',
    'acciones'
  ];
  listVehiculos: MatTableDataSource<any>;
  public searchKey: string;
  @ViewChild(MatPaginator, {static: false}) paginator3: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;



  constructor(
    public generalService: GeneralService,
    public vehiculosServ: VehiculosService,
    public modalCtr: ModalController,
    public navigateCtrl: NavController,
    public actionSheetController: ActionSheetController,
    public sweetServ: SweetMessagesService,
    public toastServ: ToastMessageService
  ) {
    //this.loadSurveysTable();
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

  // Método para cargar datos de los campus
  loadVehiculosTable(_data?: VehiculosI[]) {
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
      console.log(this.vehiculos);
      this.vehiculosServ.getAll().subscribe(response => {
        if (response.ok === true) {
          this.spinner = false;
          this.listVehiculos = new MatTableDataSource(response.vehiculos);
          this.listVehiculos.sort = this.sort;
          this.listVehiculos.paginator = this.paginator3;
          this.vehiculos = response.vehiculos;
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

  catchSelectedRow(_data: VehiculosI) {
    this.editVehiculo = _data;
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

  async openVehiculoStatus(_data: VehiculosI) {
    if (_data) {
      this.editVehiculo = _data;
    }
    //this.generalService.presentLoading();
    const modal = await this.modalCtr.create({
      component: VehiculosEstatusFormComponent,
      componentProps: {
        'asModal': true,
        'vehiculo_id': (_data && _data.id) ? _data.id : null
      },
      swipeToClose: false,
      backdropDismiss: false,
      cssClass: 'small-form'
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

  inactiveVehiculo(_data: VehiculosI) {
    this.sweetServ.confirmRequest('¿Estás seguro de querer deshabilitar este registro ?').then((data) => {
      if (data.value) {
        this.vehiculosServ.setInactive(_data.id).subscribe(res => {
          if (res.ok === true) {
            this.toastServ.presentToast('success', res.message, 'top');
            this.loadVehiculosTable();
          }
        }, error => {
          console.log(error);
          this.sweetServ.printStatusArray(error.error.errors, 'error');
        });
      }
    });
  }

  activeVehiculo(_data: VehiculosI) {
    this.sweetServ.confirmRequest('¿Estás seguro de querer habilitar este registro ?').then((data) => {
      if (data.value) {
        this.vehiculosServ.setEnable(_data.id).subscribe(res => {
          if (res.ok === true) {
            this.toastServ.presentToast('success', res.message, 'top');
            this.loadVehiculosTable();
          }
        }, error => {
          console.log(error);
          this.sweetServ.printStatusArray(error.error.errors, 'error');
        });
      }
    });
  }

}

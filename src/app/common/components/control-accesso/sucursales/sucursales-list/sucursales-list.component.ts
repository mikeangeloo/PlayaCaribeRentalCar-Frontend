import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {HotelesI} from "../../../../../interfaces/hoteles/hoteles.interface";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {GeneralService} from "../../../../../services/general.service";
import {HotelesService} from "../../../../../services/hoteles.service";
import {ActionSheetController, ModalController, NavController} from "@ionic/angular";
import {SweetMessagesService} from "../../../../../services/sweet-messages.service";
import {ToastMessageService} from "../../../../../services/toast-message.service";
import * as moment from "moment";
import {TxtConv} from "../../../../../helpers/txt-conv";
import {HotelFormComponent} from "../../../hoteles/listado-hoteles/hotel-form/hotel-form.component";
import {SucursalesI} from "../../../../../interfaces/sucursales.interface";
import {SucursalesService} from "../../../../../services/sucursales.service";
import {SucursalFormComponent} from "../sucursal-form/sucursal-form.component";

@Component({
  selector: 'app-sucursales-list',
  templateUrl: './sucursales-list.component.html',
  styleUrls: ['./sucursales-list.component.scss'],
})
export class SucursalesListComponent implements OnInit, OnChanges {

  public spinner = false;
  public editSucursal: SucursalesI;
  @Input() public sucursales: SucursalesI[] = [];
  @Input() isModal: boolean;
  @Output() emitData = new EventEmitter();
  displayedColumns: string[] = [
    'id',
    'nombre',
    'direccion',
    'codigo',
    'cp',
    'activo',
    'created_at',
    'acciones'
  ];
  listSucursales: MatTableDataSource<any>;
  public searchKey: string;
  @ViewChild(MatPaginator, {static: false}) paginator3: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;



  constructor(
    public generalService: GeneralService,
    public sucursalesService: SucursalesService,
    public modalCtr: ModalController,
    public navigateCtrl: NavController,
    public actionSheetController: ActionSheetController,
    public sweetServ: SweetMessagesService,
    public toastServ: ToastMessageService
  ) {
    //this.loadSurveysTable();
    this.initSucursales();
  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    const sucursalesChange = changes.sucursales;
    if (sucursalesChange.isFirstChange() === true || sucursalesChange.firstChange === false) {
      if (this.sucursales) {
        this.loadSucursalesTable(this.sucursales);
      } else {
        this.loadSucursalesTable();
      }
    }
  }

  initSucursales() {
    const currDate = moment().format('YYYY-MM-DD');
    this.editSucursal = {
      id: 0,
    };
  }

  // Método para cargar datos de los campus
  loadSucursalesTable(_sucursales?: SucursalesI[]) {
    //this.listado-hoteles = null;
    this.listSucursales = null;
    this.initSucursales();
    this.spinner = true;

    if (_sucursales) {
      this.sucursales = _sucursales;
      this.spinner = false;
      this.listSucursales = new MatTableDataSource(_sucursales);
      this.listSucursales.sort = this.sort;
      this.listSucursales.paginator = this.paginator3;
    } else {
      this.sucursalesService.getAll().subscribe(response => {
        if (response.ok === true) {
          this.spinner = false;
          this.listSucursales = new MatTableDataSource(response.sucursales);
          this.listSucursales.sort = this.sort;
          this.listSucursales.paginator = this.paginator3;
          this.sucursales = response.sucursales;
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
    this.listSucursales.filter = TxtConv.txtCon(searchValue, 'lowercase');
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

  catchSelectedRow(_sucursal: SucursalesI) {
    this.editSucursal = _sucursal;
  }
  // Método para editar survey
  async openSucursalForm(_sucursal?: SucursalesI) {
    if (_sucursal) {
      this.editSucursal = _sucursal;
    } else {
      this.initSucursales();
    }
    //this.generalService.presentLoading();
    const modal = await this.modalCtr.create({
      component: SucursalFormComponent,
      componentProps: {
        'asModal': true,
        'sucursal_id': (_sucursal && _sucursal.id) ? _sucursal.id : null
      },
      swipeToClose: true,
      cssClass: 'edit-form'
    });
    await modal.present();
    const {data} = await modal.onWillDismiss();
    if (data.reload && data.reload === true) {
      this.loadSucursalesTable();
    }
  }

  inactiveSucursal(sucursal: SucursalesI) {
    this.sweetServ.confirmRequest('¿Estás seguro de querer deshabilitar este registro ?').then((data) => {
      if (data.value) {
        this.sucursalesService.setInactive(sucursal.id).subscribe(res => {
          if (res.ok === true) {
            this.toastServ.presentToast('success', res.message, 'top');
            this.loadSucursalesTable();
          }
        }, error => {
          console.log(error);
          this.sweetServ.printStatusArray(error.error.errors, 'error');
        });
      }
    });
  }

  activeSucursal(sucursal: SucursalesI) {
    this.sweetServ.confirmRequest('¿Estás seguro de querer habilitar este registro ?').then((data) => {
      if (data.value) {
        this.sucursalesService.setEnable(sucursal.id).subscribe(res => {
          if (res.ok === true) {
            this.toastServ.presentToast('success', res.message, 'top');
            this.loadSucursalesTable();
          }
        }, error => {
          console.log(error);
          this.sweetServ.printStatusArray(error.error.errors, 'error');
        });
      }
    });
  }

}

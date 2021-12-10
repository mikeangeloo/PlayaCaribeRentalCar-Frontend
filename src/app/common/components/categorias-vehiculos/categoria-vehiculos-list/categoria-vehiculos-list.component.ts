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
import {CategoriasVehiculosI} from "../../../../interfaces/catalogo-vehiculos/categorias-vehiculos.interface";
import {CategoriaVehiculosService} from "../../../../services/categoria-vehiculos.service";
import {CategoriaVehiculosFormComponent} from "../categoria-vehiculos-form/categoria-vehiculos-form.component";

@Component({
  selector: 'app-categoria-vehiculos-list',
  templateUrl: './categoria-vehiculos-list.component.html',
  styleUrls: ['./categoria-vehiculos-list.component.scss'],
})
export class CategoriaVehiculosListComponent implements OnInit, OnChanges {

  public spinner = false;
  public editCategoriasVehiculos: CategoriasVehiculosI;
  @Input() public categoriasVehiculos: CategoriasVehiculosI[] = [];
  @Input() isModal: boolean;
  @Output() emitData = new EventEmitter();
  displayedColumns: string[] = [
    'id',
    'categoria',
    'activo',
    'created_at',
    'acciones'
  ];
  listCatVehiculos: MatTableDataSource<any>;
  public searchKey: string;
  @ViewChild(MatPaginator, {static: false}) paginator3: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;



  constructor(
    public generalService: GeneralService,
    public catVehiculosServ: CategoriaVehiculosService,
    public modalCtr: ModalController,
    public navigateCtrl: NavController,
    public actionSheetController: ActionSheetController,
    public sweetServ: SweetMessagesService,
    public toastServ: ToastMessageService
  ) {
    //this.loadSurveysTable();
    this.initCatVehiculos();
  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    const modelosChange = changes.categoriasVehiculos;
    if (modelosChange.isFirstChange() === true || modelosChange.firstChange === false) {
      if (this.categoriasVehiculos) {
        this.loadCategoriasVehiculosTable(this.categoriasVehiculos);
      } else {
        this.loadCategoriasVehiculosTable();
      }
    }
  }

  initCatVehiculos() {
    const currDate = moment().format('YYYY-MM-DD');
    this.editCategoriasVehiculos = {
      id: 0,
    };
  }

  // Método para cargar datos de los campus
  loadCategoriasVehiculosTable(_data?: CategoriasVehiculosI[]) {
    //this.empresas = null;
    this.listCatVehiculos = null;
    this.initCatVehiculos();
    this.spinner = true;

    if (_data) {
      this.categoriasVehiculos = _data;
      this.spinner = false;
      this.listCatVehiculos = new MatTableDataSource(_data);
      this.listCatVehiculos.sort = this.sort;
      this.listCatVehiculos.paginator = this.paginator3;
    } else {
      this.catVehiculosServ.getAll().subscribe(response => {
        if (response.ok === true) {
          this.spinner = false;
          this.listCatVehiculos = new MatTableDataSource(response.categorias);
          this.listCatVehiculos.sort = this.sort;
          this.listCatVehiculos.paginator = this.paginator3;
          this.categoriasVehiculos = response.categorias;
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
    this.listCatVehiculos.filter = TxtConv.txtCon(searchValue, 'lowercase');
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

  catchSelectedRow(_data: CategoriasVehiculosI) {
    this.editCategoriasVehiculos = _data;
  }
  // Método para editar survey
  async openCatVehiculoForm(_data?: CategoriasVehiculosI) {
    if (_data) {
      this.editCategoriasVehiculos = _data;
    } else {
      this.initCatVehiculos();
    }
    //this.generalService.presentLoading();
    const modal = await this.modalCtr.create({
      component: CategoriaVehiculosFormComponent,
      componentProps: {
        'asModal': true,
        'categoria_vehiculo_id': (_data && _data.id) ? _data.id : null
      },
      swipeToClose: true,
      cssClass: 'edit-form'
    });
    await modal.present();
    const {data} = await modal.onWillDismiss();
    if (data.reload && data.reload === true) {
      this.loadCategoriasVehiculosTable();
    }
  }

  inactiveCatVehiculo(_data: CategoriasVehiculosI) {
    this.sweetServ.confirmRequest('¿Estás seguro de querer deshabilitar este registro ?').then((data) => {
      if (data.value) {
        this.catVehiculosServ.setInactive(_data.id).subscribe(res => {
          if (res.ok === true) {
            this.toastServ.presentToast('success', res.message, 'top');
            this.loadCategoriasVehiculosTable();
          }
        }, error => {
          console.log(error);
          this.sweetServ.printStatusArray(error.error.errors, 'error');
        });
      }
    });
  }

  activeCatVehiculo(_data: CategoriasVehiculosI) {
    this.sweetServ.confirmRequest('¿Estás seguro de querer habilitar este registro ?').then((data) => {
      if (data.value) {
        this.catVehiculosServ.setEnable(_data.id).subscribe(res => {
          if (res.ok === true) {
            this.toastServ.presentToast('success', res.message, 'top');
            this.loadCategoriasVehiculosTable();
          }
        }, error => {
          console.log(error);
          this.sweetServ.printStatusArray(error.error.errors, 'error');
        });
      }
    });
  }
}

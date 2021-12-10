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
import {MarcasVehiculosService} from "../../../../services/marcas-vehiculos.service";
import {MarcasVehiculosI} from "../../../../interfaces/catalogo-vehiculos/marcas-vehiculos.interface";
import {MarcaVehiculoFormComponent} from "../marca-vehiculo-form/marca-vehiculo-form.component";

@Component({
  selector: 'app-marcas-vehiculos-list',
  templateUrl: './marcas-vehiculos-list.component.html',
  styleUrls: ['./marcas-vehiculos-list.component.scss'],
})
export class MarcasVehiculosListComponent implements OnInit, OnChanges {

  public spinner = false;
  public editMarca: MarcasVehiculosI;
  @Input() public marcas: MarcasVehiculosI[] = [];
  @Input() isModal: boolean;
  @Output() emitData = new EventEmitter();
  displayedColumns: string[] = [
    'id',
    'marca',
    'tipo',
    'activo',
    'created_at',
    'acciones'
  ];
  listMarcas: MatTableDataSource<any>;
  public searchKey: string;
  @ViewChild(MatPaginator, {static: false}) paginator3: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;



  constructor(
    public generalService: GeneralService,
    public marcasServ: MarcasVehiculosService,
    public modalCtr: ModalController,
    public navigateCtrl: NavController,
    public actionSheetController: ActionSheetController,
    public sweetServ: SweetMessagesService,
    public toastServ: ToastMessageService
  ) {
    //this.loadSurveysTable();
    this.initMarca();
  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    const marcasChange = changes.marcas;
    if (marcasChange.isFirstChange() === true || marcasChange.firstChange === false) {
      if (this.marcas) {
        this.loadMarcasTable(this.marcas);
      } else {
        this.loadMarcasTable();
      }
    }
  }

  initMarca() {
    const currDate = moment().format('YYYY-MM-DD');
    this.editMarca = {
      id: 0,
    };
  }

  // Método para cargar datos de los campus
  loadMarcasTable(_marcas?: MarcasVehiculosI[]) {
    //this.empresas = null;
    this.listMarcas = null;
    this.initMarca();
    this.spinner = true;

    if (_marcas) {
      this.marcas = _marcas;
      this.spinner = false;
      this.listMarcas = new MatTableDataSource(_marcas);
      this.listMarcas.sort = this.sort;
      this.listMarcas.paginator = this.paginator3;
    } else {
      this.marcasServ.getAll().subscribe(response => {
        if (response.ok === true) {
          this.spinner = false;
          this.listMarcas = new MatTableDataSource(response.marcas);
          this.listMarcas.sort = this.sort;
          this.listMarcas.paginator = this.paginator3;
          this.marcas = response.marcas;
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
    this.listMarcas.filter = TxtConv.txtCon(searchValue, 'lowercase');
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

  catchSelectedRow(_marca: MarcasVehiculosI) {
    this.editMarca = _marca;
  }
  // Método para editar survey
  async openMarcaForm(_marca?: MarcasVehiculosI) {
    if (_marca) {
      this.editMarca = _marca;
    } else {
      this.initMarca();
    }
    //this.generalService.presentLoading();
    const modal = await this.modalCtr.create({
      component: MarcaVehiculoFormComponent,
      componentProps: {
        'asModal': true,
        'marca_id': (_marca && _marca.id) ? _marca.id : null
      },
      swipeToClose: true,
      cssClass: 'edit-form'
    });
    await modal.present();
    const {data} = await modal.onWillDismiss();
    if (data.reload && data.reload === true) {
      this.loadMarcasTable();
    }
  }

  inactiveMarca(marca: MarcasVehiculosI) {
    this.sweetServ.confirmRequest('¿Estás seguro de querer deshabilitar este registro ?').then((data) => {
      if (data.value) {
        this.marcasServ.setInactive(marca.id).subscribe(res => {
          if (res.ok === true) {
            this.toastServ.presentToast('success', res.message, 'top');
            this.loadMarcasTable();
          }
        }, error => {
          console.log(error);
          this.sweetServ.printStatusArray(error.error.errors, 'error');
        });
      }
    });
  }

  activeMarca(marca: MarcasVehiculosI) {
    this.sweetServ.confirmRequest('¿Estás seguro de querer habilitar este registro ?').then((data) => {
      if (data.value) {
        this.marcasServ.setEnable(marca.id).subscribe(res => {
          if (res.ok === true) {
            this.toastServ.presentToast('success', res.message, 'top');
            this.loadMarcasTable();
          }
        }, error => {
          console.log(error);
          this.sweetServ.printStatusArray(error.error.errors, 'error');
        });
      }
    });
  }

  returnTipoMarca(tipo) {
    switch (tipo) {
      case 0:
        return 'Multi-Marca';
      case 1:
        return 'Véhiculo';
      case 2:
        return 'Motocicleta';
      default:
        return 'No especificado';
    }
  }

}

import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {MarcasVehiculosI} from "../../../../interfaces/catalogo-vehiculos/marcas-vehiculos.interface";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {GeneralService} from "../../../../services/general.service";
import {MarcasVehiculosService} from "../../../../services/marcas-vehiculos.service";
import {ActionSheetController, ModalController, NavController} from "@ionic/angular";
import {SweetMessagesService} from "../../../../services/sweet-messages.service";
import {ToastMessageService} from "../../../../services/toast-message.service";
import * as moment from "moment";
import {TxtConv} from "../../../../helpers/txt-conv";
import {MarcaVehiculoFormComponent} from "../../marcas-vehiculos/marca-vehiculo-form/marca-vehiculo-form.component";
import {ColoresI} from "../../../../interfaces/colores.interface";
import {ColoresService} from "../../../../services/colores.service";
import {ColorFormComponent} from "../color-form/color-form.component";

@Component({
  selector: 'app-colores-list',
  templateUrl: './colores-list.component.html',
  styleUrls: ['./colores-list.component.scss'],
})
export class ColoresListComponent implements OnInit, OnChanges {

  public spinner = false;
  public editColor: ColoresI;
  @Input() public colores: ColoresI[] = [];
  @Input() isModal: boolean;
  @Output() emitData = new EventEmitter();
  displayedColumns: string[] = [
    'id',
    'color',
    'activo',
    'created_at',
    'acciones'
  ];
  listColores: MatTableDataSource<any>;
  public searchKey: string;
  @ViewChild(MatPaginator, {static: false}) paginator3: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;



  constructor(
    public generalService: GeneralService,
    public coloresServ: ColoresService,
    public modalCtr: ModalController,
    public navigateCtrl: NavController,
    public actionSheetController: ActionSheetController,
    public sweetServ: SweetMessagesService,
    public toastServ: ToastMessageService
  ) {
    //this.loadSurveysTable();
    this.initColor();
  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    const coloresChange = changes.colores;
    if (coloresChange.isFirstChange() === true || coloresChange.firstChange === false) {
      if (this.colores) {
        this.loadColoresTable(this.colores);
      } else {
        this.loadColoresTable();
      }
    }
  }

  initColor() {
    const currDate = moment().format('YYYY-MM-DD');
    this.editColor = {
      id: 0,
    };
  }

  // Método para cargar datos de los campus
  loadColoresTable(_colores?: ColoresI[]) {
    //this.empresas = null;
    this.listColores = null;
    this.initColor();
    this.spinner = true;

    if (_colores) {
      this.colores = _colores;
      this.spinner = false;
      this.listColores = new MatTableDataSource(_colores);
      this.listColores.sort = this.sort;
      this.listColores.paginator = this.paginator3;
    } else {
      this.coloresServ.getAll().subscribe(response => {
        if (response.ok === true) {
          this.spinner = false;
          this.listColores = new MatTableDataSource(response.colores);
          this.listColores.sort = this.sort;
          this.listColores.paginator = this.paginator3;
          this.colores = response.colores;
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
    this.listColores.filter = TxtConv.txtCon(searchValue, 'lowercase');
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

  catchSelectedRow(_color: ColoresI) {
    this.editColor = _color;
  }
  // Método para editar survey
  async openColorForm(_color?: ColoresI) {
    if (_color) {
      this.editColor = _color;
    } else {
      this.initColor();
    }
    //this.generalService.presentLoading();
    const modal = await this.modalCtr.create({
      component: ColorFormComponent,
      componentProps: {
        'asModal': true,
        'color_id': (_color && _color.id) ? _color.id : null
      },
      swipeToClose: true,
      cssClass: 'edit-form'
    });
    await modal.present();
    const {data} = await modal.onWillDismiss();
    if (data.reload && data.reload === true) {
      this.loadColoresTable();
    }
  }

  inactiveMarca(_color: ColoresI) {
    this.sweetServ.confirmRequest('¿Estás seguro de querer deshabilitar este registro ?').then((data) => {
      if (data.value) {
        this.coloresServ.setInactive(_color.id).subscribe(res => {
          if (res.ok === true) {
            this.toastServ.presentToast('success', res.message, 'top');
            this.loadColoresTable();
          }
        }, error => {
          console.log(error);
          this.sweetServ.printStatusArray(error.error.errors, 'error');
        });
      }
    });
  }

  activeColor(_color: ColoresI) {
    this.sweetServ.confirmRequest('¿Estás seguro de querer habilitar este registro ?').then((data) => {
      if (data.value) {
        this.coloresServ.setEnable(_color.id).subscribe(res => {
          if (res.ok === true) {
            this.toastServ.presentToast('success', res.message, 'top');
            this.loadColoresTable();
          }
        }, error => {
          console.log(error);
          this.sweetServ.printStatusArray(error.error.errors, 'error');
        });
      }
    });
  }
}

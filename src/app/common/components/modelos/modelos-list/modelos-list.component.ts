import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {MarcasI} from "../../../../interfaces/marcas.interface";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {GeneralService} from "../../../../services/general.service";
import {MarcasService} from "../../../../services/marcas.service";
import {ActionSheetController, ModalController, NavController} from "@ionic/angular";
import {SweetMessagesService} from "../../../../services/sweet-messages.service";
import {ToastMessageService} from "../../../../services/toast-message.service";
import * as moment from "moment";
import {TxtConv} from "../../../../helpers/txt-conv";
import {MarcasFormComponent} from "../../marcas/marcas-form/marcas-form.component";
import {ModelosI} from "../../../../interfaces/modelos.interface";
import {ModelosService} from "../../../../services/modelos.service";
import {ModelosFormComponent} from "../modelos-form/modelos-form.component";

@Component({
  selector: 'app-modelos-list',
  templateUrl: './modelos-list.component.html',
  styleUrls: ['./modelos-list.component.scss'],
})
export class ModelosListComponent implements OnInit, OnChanges {

  public spinner = false;
  public editModelo: ModelosI;
  @Input() public modelos: ModelosI[] = [];
  @Input() isModal: boolean;
  @Output() emitData = new EventEmitter();
  displayedColumns: string[] = [
    'id',
    'modelo',
    'marca',
    'activo',
    'created_at',
    'acciones'
  ];
  listModelos: MatTableDataSource<any>;
  public searchKey: string;
  @ViewChild(MatPaginator, {static: false}) paginator3: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;



  constructor(
    public generalService: GeneralService,
    public modelosServ: ModelosService,
    public modalCtr: ModalController,
    public navigateCtrl: NavController,
    public actionSheetController: ActionSheetController,
    public sweetServ: SweetMessagesService,
    public toastServ: ToastMessageService
  ) {
    //this.loadSurveysTable();
    this.initModelo();
  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    const modelosChange = changes.modelos;
    if (modelosChange.isFirstChange() === true || modelosChange.firstChange === false) {
      if (this.modelos) {
        this.loadModelosTable(this.modelos);
      } else {
        this.loadModelosTable();
      }
    }
  }

  initModelo() {
    const currDate = moment().format('YYYY-MM-DD');
    this.editModelo = {
      id: 0,
    };
  }

  // Método para cargar datos de los campus
  loadModelosTable(_modelo?: ModelosI[]) {
    //this.empresas = null;
    this.listModelos = null;
    this.initModelo();
    this.spinner = true;

    if (_modelo) {
      this.modelos = _modelo;
      this.spinner = false;
      this.listModelos = new MatTableDataSource(_modelo);
      this.listModelos.sort = this.sort;
      this.listModelos.paginator = this.paginator3;
    } else {
      this.modelosServ.getAll().subscribe(response => {
        if (response.ok === true) {
          this.spinner = false;
          this.listModelos = new MatTableDataSource(response.modelos);
          this.listModelos.sort = this.sort;
          this.listModelos.paginator = this.paginator3;
          this.modelos = response.modelos;
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
    this.listModelos.filter = TxtConv.txtCon(searchValue, 'lowercase');
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

  catchSelectedRow(_modelo: ModelosI) {
    this.editModelo = _modelo;
  }
  // Método para editar survey
  async openModeloForm(_modelo?: ModelosI) {
    if (_modelo) {
      this.editModelo = _modelo;
    } else {
      this.initModelo();
    }
    //this.generalService.presentLoading();
    const modal = await this.modalCtr.create({
      component: ModelosFormComponent,
      componentProps: {
        'asModal': true,
        'modelo_id': (_modelo && _modelo.id) ? _modelo.id : null
      },
      swipeToClose: true,
      cssClass: 'edit-form'
    });
    await modal.present();
    const {data} = await modal.onWillDismiss();
    if (data.reload && data.reload === true) {
      this.loadModelosTable();
    }
  }

  inactiveModelo(_modelo: ModelosI) {
    this.sweetServ.confirmRequest('¿Estás seguro de querer deshabilitar este registro ?').then((data) => {
      if (data.value) {
        this.modelosServ.setInactive(_modelo.id).subscribe(res => {
          if (res.ok === true) {
            this.toastServ.presentToast('success', res.message, 'top');
            this.loadModelosTable();
          }
        }, error => {
          console.log(error);
          this.sweetServ.printStatusArray(error.error.errors, 'error');
        });
      }
    });
  }

  activeModelo(_modelo: ModelosI) {
    this.sweetServ.confirmRequest('¿Estás seguro de querer habilitar este registro ?').then((data) => {
      if (data.value) {
        this.modelosServ.setEnable(_modelo.id).subscribe(res => {
          if (res.ok === true) {
            this.toastServ.presentToast('success', res.message, 'top');
            this.loadModelosTable();
          }
        }, error => {
          console.log(error);
          this.sweetServ.printStatusArray(error.error.errors, 'error');
        });
      }
    });
  }
}

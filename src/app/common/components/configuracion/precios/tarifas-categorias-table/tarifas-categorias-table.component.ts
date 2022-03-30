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
import {TarifasCategoriasI} from '../../../../../interfaces/configuracion/tarifas-categorias.interface';
import {TarifasCategoriasService} from '../../../../../services/tarifas-categorias.service';
import {TarifaCategoriaFormComponent} from '../tarifa-categoria-form/tarifa-categoria-form.component';
import {TarifasApolloConfFormComponent} from '../tarifas-apollo-conf-form/tarifas-apollo-conf-form.component';

@Component({
  selector: 'app-tarifas-categorias-table',
  templateUrl: './tarifas-categorias-table.component.html',
  styleUrls: ['./tarifas-categorias-table.component.scss'],
})
export class TarifasCategoriasTableComponent implements OnInit {

  public spinner = false;
  public editTarifa: TarifasCategoriasI;
  @Input() public tarifas: TarifasCategoriasI[] = [];
  @Input() isModal: boolean;
  @Output() emitData = new EventEmitter();
  displayedColumns: string[] = [
    'id',
    'categoria',
    'precio',
    'activo',
    'created_at',
    'acciones'
  ];
  listTarifas: MatTableDataSource<any>;
  public searchKey: string;
  @ViewChild(MatPaginator, {static: false}) paginator3: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;



  constructor(
    public generalService: GeneralService,
    public tarifasCategoriasServ: TarifasCategoriasService,
    public modalCtr: ModalController,
    public navigateCtrl: NavController,
    public actionSheetController: ActionSheetController,
    public sweetServ: SweetMessagesService,
    public toastServ: ToastMessageService
  ) {
    this.initTarifasCat();
  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('cahnge');
    const modelosChange = changes.tarifas;
    if (modelosChange.isFirstChange() === true || modelosChange.firstChange === false) {
      if (this.tarifas) {
        this.loadTarifasCatTable(this.tarifas);
      } else {
        this.loadTarifasCatTable();
      }
    }
  }

  initTarifasCat() {
    const currDate = moment().format('YYYY-MM-DD');
    this.editTarifa = {
      id: 0,
    };
  }

  // Método para cargar datos de los campus
  loadTarifasCatTable(_data?: TarifasCategoriasI[]) {
    console.log('ready');
    //this.listado-hoteles = null;
    this.listTarifas = null;
    this.initTarifasCat();
    this.spinner = true;

    if (_data) {
      this.tarifas = _data;
      this.spinner = false;
      this.listTarifas = new MatTableDataSource(_data);
      this.listTarifas.sort = this.sort;
      this.listTarifas.paginator = this.paginator3;
    } else {
      this.tarifasCategoriasServ.getAll().subscribe(response => {
        if (response.ok === true) {
          this.spinner = false;
          this.listTarifas = new MatTableDataSource(response.data);
          this.listTarifas.sort = this.sort;
          this.listTarifas.paginator = this.paginator3;
          this.tarifas = response.data;
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
    this.listTarifas.filter = TxtConv.txtCon(searchValue, 'lowercase');
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

  catchSelectedRow(_data: TarifasCategoriasI) {
    this.editTarifa = _data;
  }
  // Método para editar survey
  async openTarifaCatForm(_data?: TarifasCategoriasI) {
    if (_data) {
      this.editTarifa = _data;
    } else {
      this.initTarifasCat();
    }
    //this.generalService.presentLoading();
    const modal = await this.modalCtr.create({
      component: TarifaCategoriaFormComponent,
      componentProps: {
        'asModal': true,
        'tarifa_categoria_id': (_data && _data.id) ? _data.id : null
      },
      swipeToClose: true,
      cssClass: 'edit-form'
    });
    await modal.present();
    const {data} = await modal.onWillDismiss();
    if (data.reload && data.reload === true) {
      this.loadTarifasCatTable();
    }
  }

  async openTarifasApolloConfForm() {
    const modal = await this.modalCtr.create({
      component: TarifasApolloConfFormComponent,
      componentProps: {
        'asModal': true,
        'model': 'tarifas_categorias'
      },
      swipeToClose: true,
      cssClass: 'edit-form'
    });
    await modal.present();
    const {data} = await modal.onWillDismiss();
    if (data.reload && data.reload === true) {
      this.loadTarifasCatTable();
    }
  }

  inactiveTarifaCat(_data: TarifasCategoriasI) {
    this.sweetServ.confirmRequest('¿Estás seguro de querer deshabilitar este registro ?').then((data) => {
      if (data.value) {
        this.tarifasCategoriasServ.setInactive(_data.id).subscribe(res => {
          if (res.ok === true) {
            this.toastServ.presentToast('success', res.message, 'top');
            this.loadTarifasCatTable();
          }
        }, error => {
          console.log(error);
          this.sweetServ.printStatusArray(error.error.errors, 'error');
        });
      }
    });
  }

  activeTarifaCat(_data: TarifasCategoriasI) {
    this.sweetServ.confirmRequest('¿Estás seguro de querer habilitar este registro ?').then((data) => {
      if (data.value) {
        this.tarifasCategoriasServ.setEnable(_data.id).subscribe(res => {
          if (res.ok === true) {
            this.toastServ.presentToast('success', res.message, 'top');
            this.loadTarifasCatTable();
          }
        }, error => {
          console.log(error);
          this.sweetServ.printStatusArray(error.error.errors, 'error');
        });
      }
    });
  }

}

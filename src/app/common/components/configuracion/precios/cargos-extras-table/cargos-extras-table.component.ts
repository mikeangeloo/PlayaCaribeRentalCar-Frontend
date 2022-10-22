import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {GeneralService} from '../../../../../services/general.service';
import {ActionSheetController, ModalController, NavController} from '@ionic/angular';
import {SweetMessagesService} from '../../../../../services/sweet-messages.service';
import {ToastMessageService} from '../../../../../services/toast-message.service';
import * as moment from 'moment';
import {TxtConv} from '../../../../../helpers/txt-conv';
import { CargosExtrasFormComponent } from '../cargos-extras-form/cargos-extras-form.component';
import { CargosRetornoExtrasService } from 'src/app/services/cargos-retorno-extras.service';
import { CargosExtraI } from 'src/app/interfaces/configuracion/cargos-extras.interface';

@Component({
  selector: 'app-cargos-extras-table',
  templateUrl: './cargos-extras-table.component.html',
  styleUrls: ['./cargos-extras-table.component.scss'],
})
export class CargosExtrasTableComponent implements OnInit, OnChanges {
  public spinner = false;
  public editCargosExtras: CargosExtraI;
  @Input() public cargosExtras: CargosExtraI[] = [];
  @Input() isModal: boolean;
  @Output() emitData = new EventEmitter();
  displayedColumns: string[] = [
    'id',
    'nombre',
    'tipo',
    'precio',
    'activo',
    'created_at',
    'acciones'
  ];
  listCargosExtras: MatTableDataSource<any>;
  public searchKey: string;
  @ViewChild(MatPaginator, {static: false}) paginator3: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    public generalService: GeneralService,
    public modalCtr: ModalController,
    public navigateCtrl: NavController,
    public actionSheetController: ActionSheetController,
    public sweetServ: SweetMessagesService,
    public toastServ: ToastMessageService,
    public cargosRetornoExtrasServ: CargosRetornoExtrasService,
  ) { }


  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    console.log('cahnge');
    const modelosChange = changes.cargosExtras;
    if (modelosChange.isFirstChange() === true || modelosChange.firstChange === false) {
      if (this.cargosExtras) {
        this.loadCargosExtrasTable(this.cargosExtras);
      } else {
        this.loadCargosExtrasTable();
      }
    }
  }

  initCargosExtras() {
    const currDate = moment().format('YYYY-MM-DD');
    this.editCargosExtras = {
      id: 0,
    };
  }

  // Método para cargar datos de los campus
  loadCargosExtrasTable(_data?: CargosExtraI[]) {
    console.log('ready');
    //this.listado-hoteles = null;
    this.listCargosExtras = null;
    this.initCargosExtras();
    this.spinner = true;

    if (_data) {
      this.cargosExtras = _data;
      this.spinner = false;
      this.listCargosExtras = new MatTableDataSource(_data);
      this.listCargosExtras.sort = this.sort;
      this.listCargosExtras.paginator = this.paginator3;
    } else {
      this.cargosRetornoExtrasServ.getAll().subscribe(response => {
        if (response.ok === true) {
          this.spinner = false;
          this.listCargosExtras = new MatTableDataSource(response.datas);
          this.listCargosExtras.sort = this.sort;
          this.listCargosExtras.paginator = this.paginator3;
          this.cargosExtras = response.datas;
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
    this.listCargosExtras.filter = TxtConv.txtCon(searchValue, 'lowercase');
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

  catchSelectedRow(_data: CargosExtraI) {
    this.editCargosExtras = _data;
  }
  // Método para editar survey
  async openCargosExtrasForm(_data?: CargosExtraI) {
    if (_data) {
      this.editCargosExtras = _data;
    } else {
      this.initCargosExtras();
    }
    //this.generalService.presentLoading();
    const modal = await this.modalCtr.create({
      component: CargosExtrasFormComponent,
      componentProps: {
        'asModal': true,
        'cargo_extra_id': (_data && _data.id) ? _data.id : null
      },
      swipeToClose: true,
      cssClass: 'edit-form'
    });
    await modal.present();
    const {data} = await modal.onWillDismiss();
    if (data.reload && data.reload === true) {
      this.loadCargosExtrasTable();
    }
  }

  inactiveCargoExtra(_data: CargosExtraI) {
    this.sweetServ.confirmRequest('¿Estás seguro de querer deshabilitar este registro ?').then((data) => {
      if (data.value) {
        this.cargosRetornoExtrasServ.setInactive(_data.id).subscribe(res => {
          if (res.ok === true) {
            this.toastServ.presentToast('success', res.message, 'top');
            this.loadCargosExtrasTable();
          }
        }, error => {
          console.log(error);
          this.sweetServ.printStatusArray(error.error.errors, 'error');
        });
      }
    });
  }

  activeCargoExtra(_data: CargosExtraI) {
    this.sweetServ.confirmRequest('¿Estás seguro de querer habilitar este registro ?').then((data) => {
      if (data.value) {
        this.cargosRetornoExtrasServ.setEnable(_data.id).subscribe(res => {
          if (res.ok === true) {
            this.toastServ.presentToast('success', res.message, 'top');
            this.loadCargosExtrasTable();
          }
        }, error => {
          console.log(error);
          this.sweetServ.printStatusArray(error.error.errors, 'error');
        });
      }
    });
  }

}

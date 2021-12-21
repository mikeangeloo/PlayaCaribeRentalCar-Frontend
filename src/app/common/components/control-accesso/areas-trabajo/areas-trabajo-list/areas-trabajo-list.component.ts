import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {GeneralService} from "../../../../../services/general.service";
import {ActionSheetController, ModalController, NavController} from "@ionic/angular";
import {SweetMessagesService} from "../../../../../services/sweet-messages.service";
import {ToastMessageService} from "../../../../../services/toast-message.service";
import * as moment from "moment";
import {TxtConv} from "../../../../../helpers/txt-conv";
import {AreaTrabajoI} from "../../../../../interfaces/profile/area-trabajo.interface";
import {AreasTrabajoService} from "../../../../../services/areas-trabajo.service";
import {AreaTrabajoFormComponent} from "../area-trabajo-form/area-trabajo-form.component";

@Component({
  selector: 'app-areas-trabajo-list',
  templateUrl: './areas-trabajo-list.component.html',
  styleUrls: ['./areas-trabajo-list.component.scss'],
})
export class AreasTrabajoListComponent implements OnInit {

  public spinner = false;
  public editAreaTrabajo: AreaTrabajoI;
  @Input() public areasTrabajo: AreaTrabajoI[] = [];
  @Input() isModal: boolean;
  @Output() emitData = new EventEmitter();
  displayedColumns: string[] = [
    'id',
    'nombre',
    'activo',
    'created_at',
    'acciones'
  ];
  listAreasTrabajo: MatTableDataSource<any>;
  public searchKey: string;
  @ViewChild(MatPaginator, {static: false}) paginator3: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;



  constructor(
    public generalService: GeneralService,
    public areasTrabajoServ: AreasTrabajoService,
    public modalCtr: ModalController,
    public navigateCtrl: NavController,
    public actionSheetController: ActionSheetController,
    public sweetServ: SweetMessagesService,
    public toastServ: ToastMessageService
  ) {
    //this.loadSurveysTable();
    this.initAreaTrabajo();
  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    const areasTrabajoChange = changes.areasTrabajo;
    if (areasTrabajoChange.isFirstChange() === true || areasTrabajoChange.firstChange === false) {
      if (this.areasTrabajo) {
        this.loadAreasTrabajoTable(this.areasTrabajo);
      } else {
        this.loadAreasTrabajoTable();
      }
    }
  }

  initAreaTrabajo() {
    const currDate = moment().format('YYYY-MM-DD');
    this.editAreaTrabajo = {
      id: 0,
    };
  }

  // Método para cargar datos de los campus
  loadAreasTrabajoTable(_data?: AreaTrabajoI[]) {
    //this.listado-empresas = null;
    this.listAreasTrabajo = null;
    this.initAreaTrabajo();
    this.spinner = true;

    if (_data) {
      this.areasTrabajo = _data;
      this.spinner = false;
      this.listAreasTrabajo = new MatTableDataSource(_data);
      this.listAreasTrabajo.sort = this.sort;
      this.listAreasTrabajo.paginator = this.paginator3;
    } else {
      this.areasTrabajoServ.getAll().subscribe(response => {
        if (response.ok === true) {
          this.spinner = false;
          this.listAreasTrabajo = new MatTableDataSource(response.areas_trabajo);
          this.listAreasTrabajo.sort = this.sort;
          this.listAreasTrabajo.paginator = this.paginator3;
          this.areasTrabajo = response.areas_trabajo;
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
    this.listAreasTrabajo.filter = TxtConv.txtCon(searchValue, 'lowercase');
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

  catchSelectedRow(_data: AreaTrabajoI) {
    this.editAreaTrabajo = _data;
  }
  // Método para editar survey
  async openAreaTrabajoForm(_data?: AreaTrabajoI) {
    if (_data) {
      this.editAreaTrabajo = _data;
    } else {
      this.initAreaTrabajo();
    }
    //this.generalService.presentLoading();
    const modal = await this.modalCtr.create({
      component: AreaTrabajoFormComponent,
      componentProps: {
        'asModal': true,
        'areaTrabajo_id': (_data && _data.id) ? _data.id : null
      },
      swipeToClose: true,
      cssClass: 'edit-form'
    });
    await modal.present();
    const {data} = await modal.onWillDismiss();
    if (data.reload && data.reload === true) {
      this.loadAreasTrabajoTable();
    }
  }

  inactiveAreaTrabajo(_data: AreaTrabajoI) {
    this.sweetServ.confirmRequest('¿Estás seguro de querer deshabilitar este registro ?').then((data) => {
      if (data.value) {
        this.areasTrabajoServ.setInactive(_data.id).subscribe(res => {
          if (res.ok === true) {
            this.toastServ.presentToast('success', res.message, 'top');
            this.loadAreasTrabajoTable();
          }
        }, error => {
          console.log(error);
          this.sweetServ.printStatusArray(error.error.errors, 'error');
        });
      }
    });
  }

  activeAreaTrabajo(_data: AreaTrabajoI) {
    this.sweetServ.confirmRequest('¿Estás seguro de querer habilitar este registro ?').then((data) => {
      if (data.value) {
        this.areasTrabajoServ.setEnable(_data.id).subscribe(res => {
          if (res.ok === true) {
            this.toastServ.presentToast('success', res.message, 'top');
            this.loadAreasTrabajoTable();
          }
        }, error => {
          console.log(error);
          this.sweetServ.printStatusArray(error.error.errors, 'error');
        });
      }
    });
  }

}

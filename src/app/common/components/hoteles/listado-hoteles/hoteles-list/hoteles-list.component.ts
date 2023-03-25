import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {HotelesI} from "../../../../../interfaces/hoteles/hoteles.interface";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {GeneralService} from "../../../../../services/general.service";
import {HotelesService} from "../../../../../services/hoteles.service";
import {ActionSheetController, ModalController, NavController} from "@ionic/angular";
import * as moment from 'moment';
import {TxtConv} from "../../../../../helpers/txt-conv";
import {HotelFormComponent} from "../hotel-form/hotel-form.component";
import {SweetMessagesService} from "../../../../../services/sweet-messages.service";
import {ToastMessageService} from "../../../../../services/toast-message.service";
import {
  TarifasApolloConfFormComponent
} from '../../../configuracion/precios/tarifas-apollo-conf-form/tarifas-apollo-conf-form.component';


@Component({
  selector: 'app-hoteles-list',
  templateUrl: './hoteles-list.component.html',
  styleUrls: ['./hoteles-list.component.scss'],
})
export class HotelesListComponent implements OnInit, OnChanges {

  public spinner = false;
  public editHotel: HotelesI;
  @Input() public hoteles: HotelesI[] = [];
  @Input() isModal: boolean;
  @Output() emitData = new EventEmitter();
  displayedColumns: string[] = [
    'id',
    'nombre',
    'tipo_externo',
    'rfc',
    'direccion',
    'tel_contacto',
    'activo',
    'created_at',
    'acciones'
  ];
  listHoteles: MatTableDataSource<any>;
  public searchKey: string;
  @ViewChild(MatPaginator, {static: false}) paginator3: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;



  constructor(
    public generalService: GeneralService,
    public hotelesService: HotelesService,
    public modalCtr: ModalController,
    public navigateCtrl: NavController,
    public actionSheetController: ActionSheetController,
    public sweetServ: SweetMessagesService,
    public toastServ: ToastMessageService
  ) {
    this.initHoteles();
  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    const hotelesChange = changes.hoteles;
    if (hotelesChange.isFirstChange() === true || hotelesChange.firstChange === false) {
      if (this.hoteles) {
        console.log('array');
        this.loadHotelesTable(this.hoteles);
      } else {
        this.loadHotelesTable();
      }
    }
  }

  initHoteles() {
    const currDate = moment().format('YYYY-MM-DD');
    this.editHotel = {
      id: 0,
    };
  }

  // Método para cargar datos de los campus
  loadHotelesTable(_data?: HotelesI[]) {
    //this.listado-hoteles = null;
    this.listHoteles = null;
    this.initHoteles();
    this.spinner = true;

    if (_data) {
      this.hoteles = _data;
      this.spinner = false;
      this.listHoteles = new MatTableDataSource(_data);
      this.listHoteles.sort = this.sort;
      this.listHoteles.paginator = this.paginator3;
    } else {
      this.hotelesService.getAll().subscribe(response => {
        if (response.ok === true) {
          this.spinner = false;
          this.listHoteles = new MatTableDataSource(response.hoteles);
          this.listHoteles.sort = this.sort;
          this.listHoteles.paginator = this.paginator3;
          this.hoteles = response.hoteles;
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
    this.listHoteles.filter = TxtConv.txtCon(searchValue, 'lowercase');
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

  catchSelectedRow(_data: HotelesI) {
    this.editHotel = _data;
  }
  // Método para editar survey
  async openEmpresaForm(_data?: HotelesI) {
    if (_data) {
      this.editHotel = _data;
    } else {
      this.initHoteles();
    }
    //this.generalService.presentLoading();
    const modal = await this.modalCtr.create({
      component: HotelFormComponent,
      componentProps: {
        'asModal': true,
        'hotel_id': (_data && _data.id) ? _data.id : null
      },
      swipeToClose: true,
      cssClass: 'edit-form'
    });
    await modal.present();
    const {data} = await modal.onWillDismiss();
    if (data.reload && data.reload === true) {
      this.loadHotelesTable();
    }
  }

  inactiveHotel(_data: HotelesI) {
    this.sweetServ.confirmRequest('¿Estás seguro de querer deshabilitar este registro ?').then((data) => {
      if (data.value) {
        this.hotelesService.setInactive(_data.id).subscribe(res => {
          if (res.ok === true) {
            this.toastServ.presentToast('success', res.message, 'top');
            this.loadHotelesTable();
          }
        }, error => {
          console.log(error);
          this.sweetServ.printStatusArray(error.error.errors, 'error');
        });
      }
    });
  }

  activeHotel(_data: HotelesI) {
    this.sweetServ.confirmRequest('¿Estás seguro de querer habilitar este registro ?').then((data) => {
      if (data.value) {
        this.hotelesService.setEnable(_data.id).subscribe(res => {
          if (res.ok === true) {
            this.toastServ.presentToast('success', res.message, 'top');
            this.loadHotelesTable();
          }
        }, error => {
          console.log(error);
          this.sweetServ.printStatusArray(error.error.errors, 'error');
        });
      }
    });
  }


  async openTarifasApolloConfForm() {
    const modal = await this.modalCtr.create({
      component: TarifasApolloConfFormComponent,
      componentProps: {
        'asModal': true,
        'model': 'tarifas_hoteles'
      },
      swipeToClose: true,
      cssClass: 'edit-form'
    });
    await modal.present();
    const {data} = await modal.onWillDismiss();
    if (data.reload && data.reload === true) {
      this.loadHotelesTable(this.hoteles);
    }
  }
}

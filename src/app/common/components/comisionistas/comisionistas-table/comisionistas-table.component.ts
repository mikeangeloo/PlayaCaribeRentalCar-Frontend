import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {GeneralService} from "../../../../services/general.service";
import {ActionSheetController, ModalController, NavController} from "@ionic/angular";
import {SweetMessagesService} from "../../../../services/sweet-messages.service";
import {ToastMessageService} from "../../../../services/toast-message.service";
import * as moment from "moment";
import {TxtConv} from "../../../../helpers/txt-conv";
import {ComisionistasI} from "../../../../interfaces/comisionistas/comisionistas.interface";
import {ComisionistasService} from "../../../../services/comisionistas.service";
import {ComisionistaFormComponent} from "../comisionista-form/comisionista-form.component";

@Component({
  selector: 'app-comisionistas-table',
  templateUrl: './comisionistas-table.component.html',
  styleUrls: ['./comisionistas-table.component.scss'],
})
export class ComisionistasTableComponent implements OnInit {

  public spinner = false;
  public editComisionista: ComisionistasI;
  @Input() public comisionistas: ComisionistasI[] = [];
  @Input() isModal: boolean;
  @Output() emitData = new EventEmitter();
  displayedColumns: string[] = [
    'id',
    'nombre',
    'tel_contacto',
    'email_contacto',
    'comisiones_pactadas',
    'activo',
    'created_at',
    'acciones'
  ];
  listComisionistas: MatTableDataSource<any>;
  public searchKey: string;
  @ViewChild(MatPaginator, {static: false}) paginator3: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;



  constructor(
    public generalService: GeneralService,
    public comisionistasServ: ComisionistasService,
    public modalCtr: ModalController,
    public navigateCtrl: NavController,
    public actionSheetController: ActionSheetController,
    public sweetServ: SweetMessagesService,
    public toastServ: ToastMessageService
  ) {
    //this.loadSurveysTable();
    this.initComisionistas();
  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    const comisionistasChange = changes.comisionistas;
    if (comisionistasChange.isFirstChange() === true || comisionistasChange.firstChange === false) {
      if (this.comisionistas) {
        this.loadComisionistasTable(this.comisionistas);
      } else {
        this.loadComisionistasTable();
      }
    }
  }

  initComisionistas() {
    const currDate = moment().format('YYYY-MM-DD');
    this.editComisionista = {
      id: 0,
    };
  }

  // Método para cargar datos de los campus
  loadComisionistasTable(_data?: ComisionistasI[]) {
    //this.listado-hoteles = null;
    this.listComisionistas = null;
    this.initComisionistas();
    this.spinner = true;

    if (_data) {
      this.comisionistas = _data;
      this.spinner = false;
      this.listComisionistas = new MatTableDataSource(_data);
      this.listComisionistas.sort = this.sort;
      this.listComisionistas.paginator = this.paginator3;
    } else {
      this.comisionistasServ.getAll().subscribe(response => {
        if (response.ok === true) {
          this.spinner = false;
          this.listComisionistas = new MatTableDataSource(response.comisionistas);
          this.listComisionistas.sort = this.sort;
          this.listComisionistas.paginator = this.paginator3;
          this.comisionistas = response.comisionistas;
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
    this.listComisionistas.filter = TxtConv.txtCon(searchValue, 'lowercase');
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

  catchSelectedRow(_data: ComisionistasI) {
    this.editComisionista = _data;
  }
  // Método para editar survey
  async openComisionistaForm(_data?: ComisionistasI) {
    if (_data) {
      this.editComisionista = _data;
    } else {
      this.initComisionistas();
    }
    //this.generalService.presentLoading();
    const modal = await this.modalCtr.create({
      component: ComisionistaFormComponent,
      componentProps: {
        'asModal': true,
        'comisionista_id': (_data && _data.id) ? _data.id : null
      },
      swipeToClose: true,
      cssClass: 'edit-form'
    });
    await modal.present();
    const {data} = await modal.onWillDismiss();
    if (data.reload && data.reload === true) {
      this.loadComisionistasTable();
    }
  }

  inactiveComisionista(_data: ComisionistasI) {
    this.sweetServ.confirmRequest('¿Estás seguro de querer deshabilitar este registro ?').then((data) => {
      if (data.value) {
        this.comisionistasServ.setInactive(_data.id).subscribe(res => {
          if (res.ok === true) {
            this.toastServ.presentToast('success', res.message, 'top');
            this.loadComisionistasTable();
          }
        }, error => {
          console.log(error);
          this.sweetServ.printStatusArray(error.error.errors, 'error');
        });
      }
    });
  }

  activeComisionista(_data: ComisionistasI) {
    this.sweetServ.confirmRequest('¿Estás seguro de querer habilitar este registro ?').then((data) => {
      if (data.value) {
        this.comisionistasServ.setEnable(_data.id).subscribe(res => {
          if (res.ok === true) {
            this.toastServ.presentToast('success', res.message, 'top');
            this.loadComisionistasTable();
          }
        }, error => {
          console.log(error);
          this.sweetServ.printStatusArray(error.error.errors, 'error');
        });
      }
    });
  }
}

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
import {ClientesI} from "../../../../interfaces/clientes/clientes.interface";
import {ClientesService} from "../../../../services/clientes.service";
import {ClienteFormComponent} from "../cliente-form/cliente-form.component";

@Component({
  selector: 'app-clientes-table',
  templateUrl: './clientes-table.component.html',
  styleUrls: ['./clientes-table.component.scss'],
})
export class ClientesTableComponent implements OnInit {

  public spinner = false;
  public editCliente: ClientesI;
  @Input() public clientes: ClientesI[] = [];
  @Input() isModal: boolean;
  @Output() emitData = new EventEmitter();
  displayedColumns: string[] = [
    'id',
    'nombre',
    'apellidos',
    'telefono',
    'num_licencia',
    'licencia_exp',
    'activo',
    'created_at',
    'acciones'
  ];
  listClientes: MatTableDataSource<any>;
  public searchKey: string;
  @ViewChild(MatPaginator, {static: false}) paginator3: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;



  constructor(
    public generalService: GeneralService,
    public clientesServ: ClientesService,
    public modalCtr: ModalController,
    public navigateCtrl: NavController,
    public actionSheetController: ActionSheetController,
    public sweetServ: SweetMessagesService,
    public toastServ: ToastMessageService
  ) {
    //this.loadSurveysTable();
    this.initClientes();
  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    const clientesChange = changes.clientes;
    if (clientesChange.isFirstChange() === true || clientesChange.firstChange === false) {
      if (this.clientes) {
        this.loadClientesTable(this.clientes);
      } else {
        this.loadClientesTable();
      }
    }
  }

  initClientes() {
    const currDate = moment().format('YYYY-MM-DD');
    this.editCliente = {
      id: 0,
    };
  }

  // Método para cargar datos de los campus
  loadClientesTable(_data?: ClientesI[]) {
    //this.listado-hoteles = null;
    this.listClientes = null;
    this.initClientes();
    this.spinner = true;

    if (_data) {
      this.clientes = _data;
      this.spinner = false;
      this.listClientes = new MatTableDataSource(_data);
      this.listClientes.sort = this.sort;
      this.listClientes.paginator = this.paginator3;
    } else {
      this.clientesServ.getAll().subscribe(response => {
        if (response.ok === true) {
          this.spinner = false;
          this.listClientes = new MatTableDataSource(response.clientes);
          this.listClientes.sort = this.sort;
          this.listClientes.paginator = this.paginator3;
          this.clientes = response.clientes;
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
    this.listClientes.filter = TxtConv.txtCon(searchValue, 'lowercase');
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

  catchSelectedRow(_data: ClientesI) {
    this.editCliente = _data;
  }
  // Método para editar survey
  async openClienteForm(_data?: ClientesI) {
    if (_data) {
      this.editCliente = _data;
    } else {
      this.initClientes();
    }
    //this.generalService.presentLoading();
    const modal = await this.modalCtr.create({
      component: ClienteFormComponent,
      componentProps: {
        'asModal': true,
        'cliente_id': (_data && _data.id) ? _data.id : null
      },
      swipeToClose: true,
      cssClass: 'edit-form'
    });
    await modal.present();
    const {data} = await modal.onWillDismiss();
    if (data.reload && data.reload === true) {
      this.loadClientesTable();
    }
  }

  inactiveCliente(_data: ClientesI) {
    this.sweetServ.confirmRequest('¿Estás seguro de querer deshabilitar este registro ?').then((data) => {
      if (data.value) {
        this.clientesServ.setInactive(_data.id).subscribe(res => {
          if (res.ok === true) {
            this.toastServ.presentToast('success', res.message, 'top');
            this.loadClientesTable();
          }
        }, error => {
          console.log(error);
          this.sweetServ.printStatusArray(error.error.errors, 'error');
        });
      }
    });
  }

  activeCliente(_data: ClientesI) {
    this.sweetServ.confirmRequest('¿Estás seguro de querer habilitar este registro ?').then((data) => {
      if (data.value) {
        this.clientesServ.setEnable(_data.id).subscribe(res => {
          if (res.ok === true) {
            this.toastServ.presentToast('success', res.message, 'top');
            this.loadClientesTable();
          }
        }, error => {
          console.log(error);
          this.sweetServ.printStatusArray(error.error.errors, 'error');
        });
      }
    });
  }
}

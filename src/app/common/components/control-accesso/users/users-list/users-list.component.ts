import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {MarcasVehiculosI} from "../../../../../interfaces/catalogo-vehiculos/marcas-vehiculos.interface";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {GeneralService} from "../../../../../services/general.service";
import {MarcasVehiculosService} from "../../../../../services/marcas-vehiculos.service";
import {ActionSheetController, ModalController, NavController} from "@ionic/angular";
import {SweetMessagesService} from "../../../../../services/sweet-messages.service";
import {ToastMessageService} from "../../../../../services/toast-message.service";
import * as moment from "moment";
import {TxtConv} from "../../../../../helpers/txt-conv";
import {MarcaVehiculoFormComponent} from "../../../marcas-vehiculos/marca-vehiculo-form/marca-vehiculo-form.component";
import {UsersI} from "../../../../../interfaces/users.interface";
import {UsersService} from "../../../../../services/users.service";
import {UserFormComponent} from "../user-form/user-form.component";

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
})
export class UsersListComponent implements OnInit, OnChanges {

  public spinner = false;
  public editUsuario: UsersI;
  @Input() public usuarios: UsersI[] = [];
  @Input() isModal: boolean;
  @Output() emitData = new EventEmitter();
  displayedColumns: string[] = [
    'id',
    'nombre',
    'apellidos',
    'username',
    'rol',
    'area',
    'sucursal',
    'activo',
    'created_at',
    'acciones'
  ];
  listUsuarios: MatTableDataSource<any>;
  public searchKey: string;
  @ViewChild(MatPaginator, {static: false}) paginator3: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;



  constructor(
    public generalService: GeneralService,
    public usuariosServ: UsersService,
    public modalCtr: ModalController,
    public navigateCtrl: NavController,
    public actionSheetController: ActionSheetController,
    public sweetServ: SweetMessagesService,
    public toastServ: ToastMessageService
  ) {
    //this.loadSurveysTable();
    this.initUsuario();
  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    const usuariosChange = changes.usuarios;
    if (usuariosChange.isFirstChange() === true || usuariosChange.firstChange === false) {
      if (this.usuarios) {
        this.loadUsuariosTable(this.usuarios);
      } else {
        this.loadUsuariosTable();
      }
    }
  }

  initUsuario() {
    const currDate = moment().format('YYYY-MM-DD');
    this.editUsuario = {
      id: 0,
    };
  }

  // Método para cargar datos de los campus
  loadUsuariosTable(_usuarios?: UsersI[]) {
    //this.listado-empresas = null;
    this.listUsuarios = null;
    this.initUsuario();
    this.spinner = true;

    if (_usuarios) {
      this.usuarios = _usuarios;
      this.spinner = false;
      this.listUsuarios = new MatTableDataSource(_usuarios);
      this.listUsuarios.sort = this.sort;
      this.listUsuarios.paginator = this.paginator3;
    } else {
      console.log(this.usuarios);
      this.usuariosServ.getAll().subscribe(response => {
        if (response.ok === true) {
          this.spinner = false;
          this.listUsuarios = new MatTableDataSource(response.usuarios);
          this.listUsuarios.sort = this.sort;
          this.listUsuarios.paginator = this.paginator3;
          this.usuarios = response.usuarios;
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
    this.listUsuarios.filter = TxtConv.txtCon(searchValue, 'lowercase');
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

  catchSelectedRow(_usuario: UsersI) {
    this.editUsuario = _usuario;
  }
  // Método para editar survey
  async openUsuarioForm(_user?: UsersI) {
    if (_user) {
      this.editUsuario = _user;
    } else {
      this.initUsuario();
    }
    //this.generalService.presentLoading();
    const modal = await this.modalCtr.create({
      component: UserFormComponent,
      componentProps: {
        'asModal': true,
        'usuario_id': (_user && _user.id) ? _user.id : null
      },
      swipeToClose: true,
      cssClass: 'edit-form'
    });
    await modal.present();
    const {data} = await modal.onWillDismiss();
    if (data.reload && data.reload === true) {
      this.loadUsuariosTable();
    }
  }

  inactiveUsuario(usuario: UsersI) {
    this.sweetServ.confirmRequest('¿Estás seguro de querer deshabilitar este registro ?').then((data) => {
      if (data.value) {
        this.usuariosServ.setInactive(usuario.id).subscribe(res => {
          if (res.ok === true) {
            this.toastServ.presentToast('success', res.message, 'top');
            this.loadUsuariosTable();
          }
        }, error => {
          console.log(error);
          this.sweetServ.printStatusArray(error.error.errors, 'error');
        });
      }
    });
  }

  activeUsuario(usuario: UsersI) {
    this.sweetServ.confirmRequest('¿Estás seguro de querer habilitar este registro ?').then((data) => {
      if (data.value) {
        this.usuariosServ.setEnable(usuario.id).subscribe(res => {
          if (res.ok === true) {
            this.toastServ.presentToast('success', res.message, 'top');
            this.loadUsuariosTable();
          }
        }, error => {
          console.log(error);
          this.sweetServ.printStatusArray(error.error.errors, 'error');
        });
      }
    });
  }
}

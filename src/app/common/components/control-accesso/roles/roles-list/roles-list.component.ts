import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {AreaTrabajoI} from "../../../../../interfaces/profile/area-trabajo.interface";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {GeneralService} from "../../../../../services/general.service";
import {AreasTrabajoService} from "../../../../../services/areas-trabajo.service";
import {ActionSheetController, ModalController, NavController} from "@ionic/angular";
import {SweetMessagesService} from "../../../../../services/sweet-messages.service";
import {ToastMessageService} from "../../../../../services/toast-message.service";
import * as moment from "moment";
import {TxtConv} from "../../../../../helpers/txt-conv";
import {AreaTrabajoFormComponent} from "../../areas-trabajo/area-trabajo-form/area-trabajo-form.component";
import {RoleI} from "../../../../../interfaces/profile/role.interface";
import {RolesService} from "../../../../../services/roles.service";
import {RolFormComponent} from "../rol-form/rol-form.component";

@Component({
  selector: 'app-roles-list',
  templateUrl: './roles-list.component.html',
  styleUrls: ['./roles-list.component.scss'],
})
export class RolesListComponent implements OnInit {

  public spinner = false;
  public editRol: RoleI;
  @Input() public roles: RoleI[] = [];
  @Input() isModal: boolean;
  @Output() emitData = new EventEmitter();
  displayedColumns: string[] = [
    'id',
    'rol',
    'activo',
    'created_at',
    'acciones'
  ];
  listRoles: MatTableDataSource<any>;
  public searchKey: string;
  @ViewChild(MatPaginator, {static: false}) paginator3: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;



  constructor(
    public generalService: GeneralService,
    public rolesServ: RolesService,
    public modalCtr: ModalController,
    public navigateCtrl: NavController,
    public actionSheetController: ActionSheetController,
    public sweetServ: SweetMessagesService,
    public toastServ: ToastMessageService
  ) {
    //this.loadSurveysTable();
    this.initRoles();
  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    const rolesChange = changes.roles;
    if (rolesChange.isFirstChange() === true || rolesChange.firstChange === false) {
      if (this.roles) {
        this.loadRolesTable(this.roles);
      } else {
        this.loadRolesTable();
      }
    }
  }

  initRoles() {
    const currDate = moment().format('YYYY-MM-DD');
    this.editRol = {
      id: 0,
    };
  }

  // Método para cargar datos de los campus
  loadRolesTable(_data?: RoleI[]) {
    //this.listado-hoteles = null;
    this.listRoles = null;
    this.initRoles();
    this.spinner = true;

    if (_data) {
      this.roles = _data;
      this.spinner = false;
      this.listRoles = new MatTableDataSource(_data);
      this.listRoles.sort = this.sort;
      this.listRoles.paginator = this.paginator3;
    } else {
      this.rolesServ.getAll().subscribe(response => {
        if (response.ok === true) {
          this.spinner = false;
          this.listRoles = new MatTableDataSource(response.roles);
          this.listRoles.sort = this.sort;
          this.listRoles.paginator = this.paginator3;
          this.roles = response.roles;
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
    this.listRoles.filter = TxtConv.txtCon(searchValue, 'lowercase');
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

  catchSelectedRow(_data: RoleI) {
    this.editRol = _data;
  }
  // Método para editar survey
  async openRolForm(_data?: RoleI) {
    if (_data) {
      this.editRol = _data;
    } else {
      this.initRoles();
    }
    //this.generalService.presentLoading();
    const modal = await this.modalCtr.create({
      component: RolFormComponent,
      componentProps: {
        'asModal': true,
        'rol_id': (_data && _data.id) ? _data.id : null
      },
      swipeToClose: true,
      cssClass: 'edit-form'
    });
    await modal.present();
    const {data} = await modal.onWillDismiss();
    if (data.reload && data.reload === true) {
      this.loadRolesTable();
    }
  }

  inactiveRol(_data: RoleI) {
    this.sweetServ.confirmRequest('¿Estás seguro de querer deshabilitar este registro ?').then((data) => {
      if (data.value) {
        this.rolesServ.setInactive(_data.id).subscribe(res => {
          if (res.ok === true) {
            this.toastServ.presentToast('success', res.message, 'top');
            this.loadRolesTable();
          }
        }, error => {
          console.log(error);
          this.sweetServ.printStatusArray(error.error.errors, 'error');
        });
      }
    });
  }

  activeRol(_data: AreaTrabajoI) {
    this.sweetServ.confirmRequest('¿Estás seguro de querer habilitar este registro ?').then((data) => {
      if (data.value) {
        this.rolesServ.setEnable(_data.id).subscribe(res => {
          if (res.ok === true) {
            this.toastServ.presentToast('success', res.message, 'top');
            this.loadRolesTable();
          }
        }, error => {
          console.log(error);
          this.sweetServ.printStatusArray(error.error.errors, 'error');
        });
      }
    });
  }


}

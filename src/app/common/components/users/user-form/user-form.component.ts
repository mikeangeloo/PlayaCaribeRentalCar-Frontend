import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MarcasI} from "../../../../interfaces/marcas.interface";
import {ModalController} from "@ionic/angular";
import {MarcasService} from "../../../../services/marcas.service";
import {GeneralService} from "../../../../services/general.service";
import {SweetMessagesService} from "../../../../services/sweet-messages.service";
import {ToastMessageService} from "../../../../services/toast-message.service";
import {UsersI} from "../../../../interfaces/users.interface";
import {RoleI} from "../../../../interfaces/profile/role.interface";
import {AreaTrabajoI} from "../../../../interfaces/profile/area-trabajo.interface";
import {SucursalesI} from "../../../../interfaces/sucursales.interface";
import {UsersService} from "../../../../services/users.service";
import {RolesService} from "../../../../services/roles.service";
import {AreasTrabajoService} from "../../../../services/areas-trabajo.service";
import {SucursalesService} from "../../../../services/sucursales.service";
import {error} from "protractor";

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent implements OnInit {

  @Input() asModal: boolean;
  @Input() usuario_id: number;
  public title: string;
  public usuarioForm: FormGroup;
  public usuarioData: UsersI;

  public roles: RoleI[];
  public areaTrabajo: AreaTrabajoI[];
  public sucursales: SucursalesI[];

  constructor(
    public modalCtrl: ModalController,
    private fb: FormBuilder,
    private usuarioServ: UsersService,
    private generalServ: GeneralService,
    private sweetMsg: SweetMessagesService,
    private toastServ: ToastMessageService,
    private roleServ: RolesService,
    private areasTrabajoServ: AreasTrabajoService,
    private sucursalesServ: SucursalesService
  ) {
    this.title = 'Formulario Usuario';
    this.usuarioForm = this.fb.group({
      id: [null],
      area_trabajo_id: [null, Validators.required],
      role_id: [null, Validators.required],
      nombre: [null, Validators.required],
      apellidos: [null, Validators.required],
      email: [null, Validators.required],
      telefono: [null, Validators.required],
      username: [null, Validators.required],
      sucursal_id: [null, Validators.required],
      activo: [null],
      password: [null]
    });
  }

  get uf() {
    return this.usuarioForm.controls;
  }

  ngOnInit() {
    this.loadRoles();
    this.loadAreasTrabajo();
    this.loadSucursales();

    if (this.usuario_id) {
      this.loadUsuarioData();
    } else {
      this.usuarioData = null;
      this.initUsarioForm();
      this.uf.password.setValue(null);
      this.uf.password.enable();
    }
  }

  loadRoles() {
    this.roleServ.getActive().subscribe(res => {
      if (res.ok === true) {
        this.roles = res.roles;
      }
    }, error => {
      console.log(error);
    })
  }

  loadAreasTrabajo() {
    this.areasTrabajoServ.getActive().subscribe(res => {
      if (res.ok === true) {
        this.areaTrabajo = res.areas_trabajo;
      }
    }, error =>  {
      console.log(error);
    })
  }

  loadSucursales() {
    this.sucursalesServ.getActive().subscribe(res => {
      if (res.ok === true) {
        this.sucursales = res.sucursales;
      }
    }, error => {
      console.log(error);
    })
  }

  initUsarioForm(data?) {
    console.log(data);
    this.usuarioForm.setValue({
      id: (data && data.id) ? data.id : null,
      area_trabajo_id: (data && data.area_trabajo_id) ? data.area_trabajo_id : null,
      role_id: (data && data.role_id) ? data.role_id : null,
      nombre: (data && data.nombre) ? data.nombre : null,
      apellidos: (data && data.apellidos) ? data.apellidos : null,
      email: (data && data.email) ? data.email : null,
      telefono: (data && data.telefono) ? data.telefono : null,
      username: (data && data.username) ? data.username : null,
      sucursal_id: (data && data.sucursal_id) ? data.sucursal_id : null,
      activo: (data && data.activo) ? data.activo : 0,
      password: (data && data.password) ? data.password: '********'
    });
    this.uf.activo.disable();
    this.uf.password.disable();
  }



  loadUsuarioData() {
    this.generalServ.presentLoading();
    this.usuarioServ.getDataById(this.usuario_id).subscribe(res => {
      this.generalServ.dismissLoading();
      if (res.ok === true) {
        this.usuarioData = res.usuario;
        this.initUsarioForm(res.usuario);
      }
    }, error => {
      this.generalServ.dismissLoading();
      console.log(error);
    });
  }

  saveUpdate() {
    if (this.usuarioForm.invalid) {
      this.sweetMsg.printStatus('Debe llenar los campos requeridos', 'warning');
      this.usuarioForm.markAllAsTouched();
      return;
    }
    this.generalServ.presentLoading('Guardando cambios ...');
    this.usuarioServ.saveUpdate(this.usuarioForm.value, this.usuario_id).subscribe(res => {
      this.generalServ.dismissLoading();
      this.dismiss(true);
      if (res.ok === true) {
        this.toastServ.presentToast('success', res.message, 'top');
      }
    }, error => {
      console.log(error);
      this.generalServ.dismissLoading();
    });
  }

  dismiss(reload?) {
    this.modalCtrl.dismiss({
      reload
    });
  }

}

import { NgModule } from '@angular/core';
import {CommonModule, CurrencyPipe} from '@angular/common';
import {EmpresasListComponent} from "./components/empresas/listado-empresas/empresas-list/empresas-list.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MaterialModule} from "../material/material.module";
import {IonicModule} from "@ionic/angular";
import {RouterModule} from "@angular/router";
import {EmpresaFormComponent} from "./components/empresas/listado-empresas/empresa-form/empresa-form.component";
import {SucursalesListComponent} from "./components/control-accesso/sucursales/sucursales-list/sucursales-list.component";
import {SucursalFormComponent} from "./components/control-accesso/sucursales/sucursal-form/sucursal-form.component";
import {MarcasVehiculosListComponent} from "./components/marcas-vehiculos/marcas-vehiculos-list/marcas-vehiculos-list.component";
import {MarcaVehiculoFormComponent} from "./components/marcas-vehiculos/marca-vehiculo-form/marca-vehiculo-form.component";
import {CategoriaVehiculosListComponent} from "./components/categorias-vehiculos/categoria-vehiculos-list/categoria-vehiculos-list.component";
import {CategoriaVehiculosFormComponent} from "./components/categorias-vehiculos/categoria-vehiculos-form/categoria-vehiculos-form.component";
import {UserFormComponent} from "./components/control-accesso/users/user-form/user-form.component";
import {UsersListComponent} from "./components/control-accesso/users/users-list/users-list.component";
import {AreasTrabajoListComponent} from "./components/control-accesso/areas-trabajo/areas-trabajo-list/areas-trabajo-list.component";
import {AreaTrabajoFormComponent} from "./components/control-accesso/areas-trabajo/area-trabajo-form/area-trabajo-form.component";
import {RolesListComponent} from "./components/control-accesso/roles/roles-list/roles-list.component";
import {RolFormComponent} from "./components/control-accesso/roles/rol-form/rol-form.component";
import {VehiculosListComponent} from "./components/vehiculos/vehiculos-list/vehiculos-list.component";
import {VehiculoFormComponent} from "./components/vehiculos/vehiculo-form/vehiculo-form.component";
import {ComisionistasTableComponent} from "./components/empresas/comisionistas/comisionistas-table/comisionistas-table.component";
import {ComisionistaFormComponent} from "./components/empresas/comisionistas/comisionista-form/comisionista-form.component";
import {ClientesTableComponent} from "./components/clientes/clientes-table/clientes-table.component";
import {ClienteFormComponent} from "./components/clientes/cliente-form/cliente-form.component";
import {TarjetaFormComponent} from "./components/tarjetas/tarjeta-form/tarjeta-form.component";
import {MatChipsModule} from "@angular/material/chips";
import {CameraComponent} from "./components/camera/camera.component";



@NgModule({
  declarations: [
    EmpresasListComponent,
    EmpresaFormComponent,
    SucursalesListComponent,
    SucursalFormComponent,
    MarcasVehiculosListComponent,
    MarcaVehiculoFormComponent,
    CategoriaVehiculosListComponent,
    CategoriaVehiculosFormComponent,
    UserFormComponent,
    UsersListComponent,
    AreasTrabajoListComponent,
    AreaTrabajoFormComponent,
    RolesListComponent,
    RolFormComponent,
    VehiculosListComponent,
    VehiculoFormComponent,
    ComisionistasTableComponent,
    ComisionistaFormComponent,
    ClientesTableComponent,
    ClienteFormComponent,
    TarjetaFormComponent,
    CameraComponent
  ],
  exports: [
    EmpresasListComponent,
    EmpresaFormComponent,
    SucursalesListComponent,
    SucursalFormComponent,
    MarcasVehiculosListComponent,
    MarcaVehiculoFormComponent,
    CategoriaVehiculosListComponent,
    CategoriaVehiculosFormComponent,
    UserFormComponent,
    UsersListComponent,
    AreasTrabajoListComponent,
    AreaTrabajoFormComponent,
    RolesListComponent,
    RolFormComponent,
    VehiculosListComponent,
    VehiculoFormComponent,
    ComisionistasTableComponent,
    ComisionistaFormComponent,
    ClientesTableComponent,
    ClienteFormComponent,
    TarjetaFormComponent,
    CameraComponent
  ],
  entryComponents: [
    EmpresasListComponent,
    EmpresaFormComponent,
    SucursalesListComponent,
    SucursalFormComponent,
    MarcasVehiculosListComponent,
    MarcaVehiculoFormComponent,
    CategoriaVehiculosListComponent,
    CategoriaVehiculosFormComponent,
    UserFormComponent,
    UsersListComponent,
    AreasTrabajoListComponent,
    AreaTrabajoFormComponent,
    RolesListComponent,
    RolFormComponent,
    VehiculosListComponent,
    VehiculoFormComponent,
    ComisionistasTableComponent,
    ComisionistaFormComponent,
    ClientesTableComponent,
    ClienteFormComponent,
    TarjetaFormComponent,
    CameraComponent
  ],
    imports: [
        CommonModule,
        FormsModule,
        MaterialModule,
        IonicModule,
        RouterModule,
        ReactiveFormsModule,
        MatChipsModule
    ],
  providers: [
    CurrencyPipe
  ]
})
export class AppCommonModule { }

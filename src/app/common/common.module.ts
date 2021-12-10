import { NgModule } from '@angular/core';
import {CommonModule, CurrencyPipe} from '@angular/common';
import {EmpresasListComponent} from "./components/empresas/empresas-list/empresas-list.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MaterialModule} from "../material/material.module";
import {IonicModule} from "@ionic/angular";
import {RouterModule} from "@angular/router";
import {EmpresaFormComponent} from "./components/empresas/empresa-form/empresa-form.component";
import {SucursalesListComponent} from "./components/sucursales/sucursales-list/sucursales-list.component";
import {SucursalFormComponent} from "./components/sucursales/sucursal-form/sucursal-form.component";
import {MarcasVehiculosListComponent} from "./components/marcas-vehiculos/marcas-vehiculos-list/marcas-vehiculos-list.component";
import {MarcaVehiculoFormComponent} from "./components/marcas-vehiculos/marca-vehiculo-form/marca-vehiculo-form.component";
import {CategoriaVehiculosListComponent} from "./components/categorias-vehiculos/categoria-vehiculos-list/categoria-vehiculos-list.component";
import {CategoriaVehiculosFormComponent} from "./components/categorias-vehiculos/categoria-vehiculos-form/categoria-vehiculos-form.component";
import {ColoresListComponent} from "./components/colores/colores-list/colores-list.component";
import {ColorFormComponent} from "./components/colores/color-form/color-form.component";
import {UserFormComponent} from "./components/users/user-form/user-form.component";
import {UsersListComponent} from "./components/users/users-list/users-list.component";
import {AreasTrabajoListComponent} from "./components/areas-trabajo/areas-trabajo-list/areas-trabajo-list.component";
import {AreaTrabajoFormComponent} from "./components/areas-trabajo/area-trabajo-form/area-trabajo-form.component";
import {RolesListComponent} from "./components/roles/roles-list/roles-list.component";
import {RolFormComponent} from "./components/roles/rol-form/rol-form.component";
import {VehiculosListComponent} from "./components/vehiculos/vehiculos-list/vehiculos-list.component";
import {VehiculoFormComponent} from "./components/vehiculos/vehiculo-form/vehiculo-form.component";



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
    ColoresListComponent,
    ColorFormComponent,
    UserFormComponent,
    UsersListComponent,
    AreasTrabajoListComponent,
    AreaTrabajoFormComponent,
    RolesListComponent,
    RolFormComponent,
    VehiculosListComponent,
    VehiculoFormComponent
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
    ColoresListComponent,
    ColorFormComponent,
    UserFormComponent,
    UsersListComponent,
    AreasTrabajoListComponent,
    AreaTrabajoFormComponent,
    RolesListComponent,
    RolFormComponent,
    VehiculosListComponent,
    VehiculoFormComponent
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
    ColoresListComponent,
    ColorFormComponent,
    UserFormComponent,
    UsersListComponent,
    AreasTrabajoListComponent,
    AreaTrabajoFormComponent,
    RolesListComponent,
    RolFormComponent,
    VehiculosListComponent,
    VehiculoFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    IonicModule,
    RouterModule,
    ReactiveFormsModule
  ],
  providers: [
    CurrencyPipe
  ]
})
export class AppCommonModule { }

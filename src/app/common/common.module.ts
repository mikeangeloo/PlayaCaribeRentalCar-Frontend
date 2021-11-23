import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {EmpresasListComponent} from "./components/empresas/empresas-list/empresas-list.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MaterialModule} from "../material/material.module";
import {IonicModule} from "@ionic/angular";
import {RouterModule} from "@angular/router";
import {EmpresaFormComponent} from "./components/empresas/empresa-form/empresa-form.component";
import {SucursalesListComponent} from "./components/sucursales/sucursales-list/sucursales-list.component";
import {SucursalFormComponent} from "./components/sucursales/sucursal-form/sucursal-form.component";



@NgModule({
  declarations: [
    EmpresasListComponent,
    EmpresaFormComponent,
    SucursalesListComponent,
    SucursalFormComponent
  ],
  exports: [
    EmpresasListComponent,
    EmpresaFormComponent,
    SucursalesListComponent,
    SucursalFormComponent
  ],
  entryComponents: [
    EmpresasListComponent,
    EmpresaFormComponent,
    SucursalesListComponent,
    SucursalFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    IonicModule,
    RouterModule,
    ReactiveFormsModule
  ]
})
export class AppCommonModule { }

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
import {MarcasListComponent} from "./components/marcas/marcas-list/marcas-list.component";
import {MarcasFormComponent} from "./components/marcas/marcas-form/marcas-form.component";
import {ModelosListComponent} from "./components/modelos/modelos-list/modelos-list.component";
import {ModelosFormComponent} from "./components/modelos/modelos-form/modelos-form.component";
import {ColoresListComponent} from "./components/colores/colores-list/colores-list.component";
import {ColorFormComponent} from "./components/colores/color-form/color-form.component";



@NgModule({
  declarations: [
    EmpresasListComponent,
    EmpresaFormComponent,
    SucursalesListComponent,
    SucursalFormComponent,
    MarcasListComponent,
    MarcasFormComponent,
    ModelosListComponent,
    ModelosFormComponent,
    ColoresListComponent,
    ColorFormComponent
  ],
  exports: [
    EmpresasListComponent,
    EmpresaFormComponent,
    SucursalesListComponent,
    SucursalFormComponent,
    MarcasListComponent,
    MarcasFormComponent,
    ModelosListComponent,
    ModelosFormComponent,
    ColoresListComponent,
    ColorFormComponent
  ],
  entryComponents: [
    EmpresasListComponent,
    EmpresaFormComponent,
    SucursalesListComponent,
    SucursalFormComponent,
    MarcasListComponent,
    MarcasFormComponent,
    ModelosListComponent,
    ModelosFormComponent,
    ColoresListComponent,
    ColorFormComponent
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

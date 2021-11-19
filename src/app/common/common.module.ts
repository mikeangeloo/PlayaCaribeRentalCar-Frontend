import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {EmpresasListComponent} from "./components/empresas/empresas-list/empresas-list.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MaterialModule} from "../material/material.module";
import {IonicModule} from "@ionic/angular";
import {RouterModule} from "@angular/router";
import {EmpresaFormComponent} from "./components/empresas/empresa-form/empresa-form.component";



@NgModule({
  declarations: [
    EmpresasListComponent,
    EmpresaFormComponent
  ],
  exports: [
    EmpresasListComponent,
    EmpresaFormComponent
  ],
  entryComponents: [
    EmpresasListComponent,
    EmpresaFormComponent
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

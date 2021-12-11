import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CategoriasVehiculosPageRoutingModule } from './categorias-vehiculos-routing.module';

import { CategoriasVehiculosPage } from './categorias-vehiculos.page';
import {AppCommonModule} from "../../../common/common.module";
import {EditCatVehiculoComponent} from "./edit-cat-vehiculo/edit-cat-vehiculo.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        CategoriasVehiculosPageRoutingModule,
        AppCommonModule
    ],
  declarations: [
    CategoriasVehiculosPage,
    EditCatVehiculoComponent
  ]
})
export class CategoriasVehiculosPageModule {}

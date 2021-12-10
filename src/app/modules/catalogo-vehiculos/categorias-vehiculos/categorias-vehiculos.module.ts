import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CategoriasVehiculosPageRoutingModule } from './categorias-vehiculos-routing.module';

import { CategoriasVehiculosPage } from './categorias-vehiculos.page';
import {AppCommonModule} from "../../../common/common.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        CategoriasVehiculosPageRoutingModule,
        AppCommonModule
    ],
  declarations: [CategoriasVehiculosPage]
})
export class CategoriasVehiculosPageModule {}

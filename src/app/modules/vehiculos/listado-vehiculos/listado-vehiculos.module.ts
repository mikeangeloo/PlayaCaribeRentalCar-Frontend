import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListadoVehiculosPageRoutingModule } from './listado-vehiculos-routing.module';

import { ListadoVehiculosPage } from './listado-vehiculos.page';
import {AppCommonModule} from "../../../common/common.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListadoVehiculosPageRoutingModule,
    AppCommonModule
  ],
  declarations: [ListadoVehiculosPage]
})
export class ListadoVehiculosPageModule {}

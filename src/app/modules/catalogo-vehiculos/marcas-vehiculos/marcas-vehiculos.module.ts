import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MarcasVehiculosPageRoutingModule } from './marcas-vehiculos-routing.module';

import { MarcasVehiculosPage } from './marcas-vehiculos.page';
import {AppCommonModule} from "../../../common/common.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MarcasVehiculosPageRoutingModule,
        AppCommonModule
    ],
  declarations: [MarcasVehiculosPage]
})
export class MarcasVehiculosPageModule {}

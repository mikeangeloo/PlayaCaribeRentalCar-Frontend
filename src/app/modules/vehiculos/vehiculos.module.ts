import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VehiculosPageRoutingModule } from './vehiculos-routing.module';

import { VehiculosPage } from './vehiculos.page';
import {AppCommonModule} from "../../common/common.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        VehiculosPageRoutingModule,
        AppCommonModule
    ],
  declarations: [VehiculosPage]
})
export class VehiculosPageModule {}

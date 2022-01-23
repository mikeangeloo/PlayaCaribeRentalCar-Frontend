import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClasesVehiculosPageRoutingModule } from './clases-vehiculos-routing.module';

import { ClasesVehiculosPage } from './clases-vehiculos.page';
import {AppCommonModule} from '../../../common/common.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ClasesVehiculosPageRoutingModule,
        AppCommonModule
    ],
  declarations: [ClasesVehiculosPage]
})
export class ClasesVehiculosPageModule {}

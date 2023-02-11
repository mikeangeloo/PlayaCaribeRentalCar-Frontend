import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PolizasPageRoutingModule } from './polizas-routing.module';

import { PolizasPage } from './polizas.page';
import {AppCommonModule} from '../../common/common.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PolizasPageRoutingModule,
    AppCommonModule
  ],
  declarations: [PolizasPage]
})
export class PolizasPageModule {}

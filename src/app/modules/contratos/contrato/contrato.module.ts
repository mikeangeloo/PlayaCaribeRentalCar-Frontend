import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContratoPageRoutingModule } from './contrato-routing.module';

import { ContratoPage } from './contrato.page';
import {MaterialModule} from "../../../material/material.module";
import {NgxMaterialTimepickerModule} from "ngx-material-timepicker";
import {AppCommonModule} from "../../../common/common.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ContratoPageRoutingModule,
        MaterialModule,
        NgxMaterialTimepickerModule,
        AppCommonModule
    ],
  declarations: [ContratoPage]
})
export class ContratoPageModule {}

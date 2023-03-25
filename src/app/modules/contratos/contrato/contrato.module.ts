import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContratoPageRoutingModule } from './contrato-routing.module';

import { ContratoPage } from './contrato.page';
import {MaterialModule} from "../../../material/material.module";
import {NgxMaterialTimepickerModule} from "ngx-material-timepicker";
import { NgxSpinnerModule } from 'ngx-spinner';
import {ReservasFormComponent} from './reservas/reservas-form/reservas-form.component';
import {AppCommonModule} from '../../../common/common.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContratoPageRoutingModule,
    MaterialModule,
    NgxMaterialTimepickerModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    AppCommonModule
  ],
  exports: [
    ContratoPage
  ],
  declarations: [ContratoPage, ReservasFormComponent]
})
export class ContratoPageModule {}

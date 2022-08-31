import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {MaterialModule} from '../../material/material.module';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import {AppCommonModule} from '../../common/common.module';

import { ReportesRoutingModule } from './reportes-routing.module';
import { EstatusVehiculosComponent } from './estatus-vehiculos/estatus-vehiculos.component';
import { MantenimientoVehiculosComponent } from './mantenimiento-vehiculos/mantenimiento-vehiculos.component';
import { ExedenteKilometrajeGasolinaComponent } from './exedente-kilometraje-gasolina/exedente-kilometraje-gasolina.component';


@NgModule({
  declarations: [
    EstatusVehiculosComponent,
    MantenimientoVehiculosComponent,
    ExedenteKilometrajeGasolinaComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaterialModule,
    NgxMaterialTimepickerModule,
    AppCommonModule,
    ReactiveFormsModule,
    ReportesRoutingModule
  ]
})
export class ReportesModule { }

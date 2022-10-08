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
import { PolizasSegurosComponent } from './polizas-seguros/polizas-seguros.component';
import {DetallePagosComponent} from './detalle-pagos/detalle-pagos.component';
import {RentasPorVehiculoComponent} from './rentas-por-vehiculo/rentas-por-vehiculo.component';
import {RentasPorComisionistasComponent} from './rentas-por-comisionistas/rentas-por-comisionistas.component';


@NgModule({
  declarations: [
    EstatusVehiculosComponent,
    MantenimientoVehiculosComponent,
    ExedenteKilometrajeGasolinaComponent,
    PolizasSegurosComponent,
    DetallePagosComponent,
    RentasPorVehiculoComponent,
    RentasPorComisionistasComponent
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

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EstatusVehiculosComponent } from './estatus-vehiculos/estatus-vehiculos.component';
import { ExedenteKilometrajeGasolinaComponent } from './exedente-kilometraje-gasolina/exedente-kilometraje-gasolina.component';
import { MantenimientoVehiculosComponent } from './mantenimiento-vehiculos/mantenimiento-vehiculos.component';
import { PolizasSegurosComponent } from './polizas-seguros/polizas-seguros.component';
import {DetallePagosComponent} from './detalle-pagos/detalle-pagos.component';

const routes: Routes = [
  {
    path: 'estatus-vehiculos',
    component: EstatusVehiculosComponent
  },
  {
    path: 'mantenimiento-vehiculos',
    component: MantenimientoVehiculosComponent
  },
  {
    path: 'exedente-kilometraje-gasolina',
    component: ExedenteKilometrajeGasolinaComponent
  },
  {
    path: 'polizas-seguros',
    component: PolizasSegurosComponent
  },
  {
    path: 'detalle-pagos',
    component: DetallePagosComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportesRoutingModule { }

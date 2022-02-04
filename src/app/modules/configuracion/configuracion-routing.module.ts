import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {TarifasExtrasPage} from './precios/tarifas-extras/tarifas-extras.page';
import {UbicacionesComponent} from './ubicaciones/ubicaciones.component';

const routes: Routes = [
  {
    path: 'precios/tarifas-extras',
    component: TarifasExtrasPage
  },
  {
    path: 'ubicaciones',
    component: UbicacionesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfiguracionRoutingModule {}

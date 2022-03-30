import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {TarifasExtrasPage} from './precios/tarifas-extras/tarifas-extras.page';
import {UbicacionesComponent} from './ubicaciones/ubicaciones.component';
import {TarifasCategoriasComponent} from './precios/tarifas-categorias/tarifas-categorias.component';

const routes: Routes = [
  {
    path: 'precios/tarifas-categorias',
    component: TarifasCategoriasComponent
  },
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

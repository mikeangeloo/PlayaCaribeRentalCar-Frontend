import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {TarifasExtrasPage} from './precios/tarifas-extras/tarifas-extras.page';
import {UbicacionesComponent} from './ubicaciones/ubicaciones.component';
import {TarifasCategoriasComponent} from './precios/tarifas-categorias/tarifas-categorias.component';
import { CargosExtrasPage } from './precios/cargos-extras/cargos-extras.page';
import {TiposCambioComponent} from './precios/tipos-cambio/tipos-cambio.component';

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
    path: 'precios/cargos-extras',
    component: CargosExtrasPage
  },
  {
    path: 'ubicaciones',
    component: UbicacionesComponent
  },
  {
    path: 'tipos-cambio',
    component: TiposCambioComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfiguracionRoutingModule {}

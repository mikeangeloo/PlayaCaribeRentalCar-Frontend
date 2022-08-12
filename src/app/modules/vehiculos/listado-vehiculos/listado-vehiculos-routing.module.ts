import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListadoVehiculosPage } from './listado-vehiculos.page';

const routes: Routes = [
  {
    path: '',
    component: ListadoVehiculosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListadoVehiculosPageRoutingModule {}

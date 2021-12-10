import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CategoriasVehiculosPage } from './categorias-vehiculos.page';

const routes: Routes = [
  {
    path: '',
    component: CategoriasVehiculosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoriasVehiculosPageRoutingModule {}

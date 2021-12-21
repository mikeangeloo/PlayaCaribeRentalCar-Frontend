import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CategoriasVehiculosPage } from './categorias-vehiculos.page';
import {EditCatVehiculoComponent} from "./edit-cat-vehiculo/edit-cat-vehiculo.component";

const routes: Routes = [
  {
    path: '',
    component: CategoriasVehiculosPage
  },
  {
    path: ':id',
    component: EditCatVehiculoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoriasVehiculosPageRoutingModule {}

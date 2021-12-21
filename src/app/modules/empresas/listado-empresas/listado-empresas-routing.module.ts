import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListadoEmpresasPage } from './listado-empresas.page';

const routes: Routes = [
  {
    path: '',
    component: ListadoEmpresasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListadoEmpresasPageRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContratoPage } from './contrato.page';

const routes: Routes = [
  {
    path: 'nuevo',
    component: ContratoPage
  },
  {
    path: 'view/:contract_number',
    component: ContratoPage
  },
  {
    path: 'nuevo/:vehicle_id',
    component: ContratoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContratoPageRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PolizasPage } from './polizas.page';

const routes: Routes = [
  {
    path: '',
    component: PolizasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PolizasPageRoutingModule {}

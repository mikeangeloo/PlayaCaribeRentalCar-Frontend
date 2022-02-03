import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClasesVehiculosPage } from './clases-vehiculos.page';

const routes: Routes = [
  {
    path: '',
    component: ClasesVehiculosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClasesVehiculosPageRoutingModule {}

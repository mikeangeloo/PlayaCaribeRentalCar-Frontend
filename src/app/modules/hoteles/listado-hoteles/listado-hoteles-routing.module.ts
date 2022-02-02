import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListadoHotelesPage } from './listado-hoteles.page';

const routes: Routes = [
  {
    path: '',
    component: ListadoHotelesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListadoHotelesPageRoutingModule {}

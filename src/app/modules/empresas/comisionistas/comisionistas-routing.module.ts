import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ComisionistasPage } from './comisionistas.page';

const routes: Routes = [
  {
    path: '',
    component: ComisionistasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComisionistasPageRoutingModule {}

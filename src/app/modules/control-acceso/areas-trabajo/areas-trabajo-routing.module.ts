import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AreasTrabajoPage } from './areas-trabajo.page';

const routes: Routes = [
  {
    path: '',
    component: AreasTrabajoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AreasTrabajoPageRoutingModule {}

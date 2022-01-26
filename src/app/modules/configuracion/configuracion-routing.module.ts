import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {TarifasExtrasPage} from './precios/tarifas-extras/tarifas-extras.page';

const routes: Routes = [
  {
    path: 'precios/tarifas-extras',
    component: TarifasExtrasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfiguracionRoutingModule {}

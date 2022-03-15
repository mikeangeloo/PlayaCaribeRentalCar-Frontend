import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {MaterialModule} from '../../material/material.module';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import {AppCommonModule} from '../../common/common.module';
import {ConfiguracionRoutingModule} from './configuracion-routing.module';
import {TarifasExtrasPage} from './precios/tarifas-extras/tarifas-extras.page';
import {UbicacionesComponent} from './ubicaciones/ubicaciones.component';
import {TarifasCategoriasComponent} from './precios/tarifas-categorias/tarifas-categorias.component';


@NgModule({
  declarations: [
    TarifasExtrasPage,
    UbicacionesComponent,
    TarifasCategoriasComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfiguracionRoutingModule,
    MaterialModule,
    NgxMaterialTimepickerModule,
    AppCommonModule,
    ReactiveFormsModule
  ],
  exports: [
    TarifasCategoriasComponent
  ]
})
export class ConfiguracionModule {
}

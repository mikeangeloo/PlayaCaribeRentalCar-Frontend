import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListadoEmpresasPageRoutingModule } from './listado-empresas-routing.module';

import { ListadoEmpresasPage } from './listado-empresas.page';
import {AppCommonModule} from "../../../common/common.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ListadoEmpresasPageRoutingModule,
        AppCommonModule
    ],
  declarations: [ListadoEmpresasPage]
})
export class ListadoEmpresasPageModule {}

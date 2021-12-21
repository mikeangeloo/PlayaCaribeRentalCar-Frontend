import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListadoClientesPageRoutingModule } from './listado-clientes-routing.module';

import { ListadoClientesPage } from './listado-clientes.page';
import {AppCommonModule} from "../../../common/common.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ListadoClientesPageRoutingModule,
        AppCommonModule
    ],
  declarations: [ListadoClientesPage]
})
export class ListadoClientesPageModule {}

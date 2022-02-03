import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListadoHotelesPageRoutingModule } from './listado-hoteles-routing.module';

import { ListadoHotelesPage } from './listado-hoteles.page';
import {AppCommonModule} from "../../../common/common.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ListadoHotelesPageRoutingModule,
        AppCommonModule
    ],
  declarations: [ListadoHotelesPage]
})
export class ListadoHotelesPageModule {}

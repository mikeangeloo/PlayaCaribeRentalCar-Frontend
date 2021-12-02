import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmpresasPageRoutingModule } from './empresas-routing.module';

import { EmpresasPage } from './empresas.page';
import {AppCommonModule} from "../../../common/common.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        EmpresasPageRoutingModule,
        AppCommonModule
    ],
  declarations: [EmpresasPage]
})
export class EmpresasPageModule {}

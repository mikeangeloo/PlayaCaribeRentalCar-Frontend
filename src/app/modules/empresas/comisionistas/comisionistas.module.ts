import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ComisionistasPageRoutingModule } from './comisionistas-routing.module';

import { ComisionistasPage } from './comisionistas.page';
import {AppCommonModule} from "../../../common/common.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ComisionistasPageRoutingModule,
        AppCommonModule
    ],
  declarations: [ComisionistasPage]
})
export class ComisionistasPageModule {}

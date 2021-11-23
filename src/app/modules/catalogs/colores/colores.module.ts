import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ColoresPageRoutingModule } from './colores-routing.module';

import { ColoresPage } from './colores.page';
import {AppCommonModule} from "../../../common/common.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ColoresPageRoutingModule,
        AppCommonModule
    ],
  declarations: [ColoresPage]
})
export class ColoresPageModule {}

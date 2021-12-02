import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModelosPageRoutingModule } from './modelos-routing.module';

import { ModelosPage } from './modelos.page';
import {AppCommonModule} from "../../../common/common.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ModelosPageRoutingModule,
        AppCommonModule
    ],
  declarations: [ModelosPage]
})
export class ModelosPageModule {}

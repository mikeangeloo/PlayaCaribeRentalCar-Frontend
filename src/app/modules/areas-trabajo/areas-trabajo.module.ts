import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AreasTrabajoPageRoutingModule } from './areas-trabajo-routing.module';

import { AreasTrabajoPage } from './areas-trabajo.page';
import {AppCommonModule} from "../../common/common.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        AreasTrabajoPageRoutingModule,
        AppCommonModule
    ],
  declarations: [AreasTrabajoPage]
})
export class AreasTrabajoPageModule {}

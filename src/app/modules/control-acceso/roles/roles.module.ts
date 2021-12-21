import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RolesPageRoutingModule } from './roles-routing.module';

import { RolesPage } from './roles.page';
import {AppCommonModule} from "../../../common/common.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RolesPageRoutingModule,
        AppCommonModule
    ],
  declarations: [RolesPage]
})
export class RolesPageModule {}

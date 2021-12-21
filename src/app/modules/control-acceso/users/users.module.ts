import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsersPageRoutingModule } from './users-routing.module';

import { UsersPage } from './users.page';
import {AppCommonModule} from "../../../common/common.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        UsersPageRoutingModule,
        AppCommonModule
    ],
  declarations: [UsersPage]
})
export class UsersPageModule {}

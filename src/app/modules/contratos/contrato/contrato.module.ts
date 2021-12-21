import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContratoPageRoutingModule } from './contrato-routing.module';

import { ContratoPage } from './contrato.page';
import {MaterialModule} from "../../../material/material.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ContratoPageRoutingModule,
        MaterialModule
    ],
  declarations: [ContratoPage]
})
export class ContratoPageModule {}

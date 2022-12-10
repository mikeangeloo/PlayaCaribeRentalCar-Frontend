import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RoleScopesDirective} from './role-scopes.directive';

@NgModule({
  declarations: [
    RoleScopesDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    RoleScopesDirective
  ]
})
export class DirectivesModule { }

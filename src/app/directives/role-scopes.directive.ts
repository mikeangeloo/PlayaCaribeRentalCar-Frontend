import {Directive, Input, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {RoleLevelsTypes} from '../enums/role-levels.enum';
import {SessionService} from '../services/session.service';


@Directive({
  selector: '[appRoleScopes]'
})
export class RoleScopesDirective implements OnInit {

  // region Atributos
  @Input() appRoleScopes: RoleLevelsTypes[];
  isVisible = false;
  userLevel: RoleLevelsTypes;
  // endregion

  // region Constructor
  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private sessionServ: SessionService
  ) {
    this.userLevel = JSON.parse(sessionStorage.getItem(this.sessionServ.levelScopeKey));
  }
  // endregion

  // region Métodos
  ngOnInit(): void {
    // Verificamos si tiene permiso para ver el recurso
    if (this.isAllowedRol()) {
      this.visibleTemplate();
    } else {
      this.hideTemplate();
    }
  }

  // Función privada para manejar si ya se aplico la directiva para crear el elemento embebido
  private visibleTemplate() {
    if (!this.isVisible) {
      this.isVisible = true;
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }
  }

  // Función para ocultar el elemento a la que se aplica la directiva
  private hideTemplate() {
    this.isVisible = false;
    this.viewContainerRef.clear();
  }
  // Función para verificar si cumple con las directivas
  public isAllowedRol(): boolean {
    if (this.userLevel && this.appRoleScopes?.length > 0) {
      if (this.appRoleScopes.includes(-1)) {
        return true
      }
      return this.appRoleScopes.includes(this.userLevel);
    } else {
      return false
    }
  }

  // endregion
}

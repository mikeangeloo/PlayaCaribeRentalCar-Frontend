import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import {SessionService} from '../services/session.service';
import {SweetMessagesService} from '../services/sweet-messages.service';
import {RoleLevelsTypes} from '../enums/role-levels.enum';
import {NavController} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class RolesScopeGuard implements CanActivate {
  private userLevel: RoleLevelsTypes;
  constructor(
    private autService: SessionService,
    private sweetMsg: SweetMessagesService,
    private navCtrl: NavController
  ) {
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.hasPermissions(next.data.allowedLevels);
  }

  protected hasPermissions(allowedLevelsTypes: RoleLevelsTypes[]) {
    // obtenemos los permisos del session storage
    this.userLevel = this.autService.getRoleLevel();
    if (this.userLevel && allowedLevelsTypes?.length > 0) {
      const isAllowed = allowedLevelsTypes.includes(this.userLevel);
      if (!isAllowed) {
        this.sweetMsg.printStatus('No tienes permisos suficientes para ingresar a este recurso.', 'error');
        this.navCtrl.navigateRoot('/welcome')
      }
      return isAllowed
    } else {
      this.sweetMsg.printStatus('No tienes permisos suficientes para ingresar a este recurso.', 'error');
      return false
    }
  }

}

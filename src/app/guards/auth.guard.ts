import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { Observable } from 'rxjs';
import {SessionService} from "../services/session.service";
import {AlertsService} from "../services/alerts.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
  public token;
  public role;

  constructor(
    private router: Router,
    private sessionService: SessionService,
    private alertService: AlertsService
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.check(next, state);
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.check(next, state);
  }

  private check(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    this.token = this.sessionService.getToken();

    if (this.token === null) {
      this.alertService.alert('Error', 'Authorized', 'Se ha expirado tu sesión, favor de ingresar de nuevo', 'OK');
      this.sessionService.logout();
      this.router.navigate(['login']);
      return false;
    } else {
      return true;
    }
  }
}

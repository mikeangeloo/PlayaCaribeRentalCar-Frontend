import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/services/session.service';
import { NavController } from '@ionic/angular';
import {error} from 'protractor';
import {ToastMessageService} from '../app/services/toast-message.service';


/*
* Helper interceptor de peticiones, funciona para inyectar las cabeceras requeridas en el backend
* */
@Injectable()

/*
* Interceptor para agregar cabecera Authorization token a todas las peticiones
* */
export class JwtInterceptor implements HttpInterceptor {
  private currentToken: string;
  constructor(
      public navigate: NavController,
      public router: Router,
      private SessionService: SessionService,
      private toastServ: ToastMessageService
  ) {}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
     // Preparamamos variables para inyectar en los headers

    // let headers: any = {
    //   // 'X-API-Key': environment.apiKey,
    // };

    let headers = {
      Authorization: '',
    } as {Authorization?: string};

    // Verificamos si esta logeado el usuario obteniendo el token

    // if (this.authService.isLogged()) {
    //   headers = {
    //     ...headers,
    //     Authorization: `Bearer ${this.authService.getToken()}`
    //   };
    // }

    if (this.SessionService.isLogged()) {
      headers = {Authorization: this.SessionService.getToken()};
    }

    // Agreamos los headers con el token
    req = req.clone({setHeaders: headers});

    return next.handle(req).pipe(tap((value: HttpEvent<any>) => {
    }), catchError((err: HttpErrorResponse) => {
      if (err.status === 500) {
        this.toastServ.presentToast('error', err.statusText, 'top');
        return throwError(err);
      }
      // si el estatos es 403 (Forbidden) redirigmos al login
      if (err.status === 403 && this.router.routerState.snapshot.url !== '/landing') {
        this.navigate.navigateRoot('/landing');
        this.SessionService.logout();
      } else if (err.status === 401) {
        this.SessionService.logout();
        this.navigate.navigateRoot('/login');
      }
      return throwError(err);
    }));
  }
}

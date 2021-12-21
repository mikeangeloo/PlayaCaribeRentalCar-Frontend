import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import {SweetMessagesService} from "./sweet-messages.service";
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class GeneralService {
  //#endregion

  constructor(
    public loadingController: LoadingController,
    public httpClient: HttpClient,
    public router: Router,
    public sweetServ: SweetMessagesService
    ) {}
  //#region Atributos
  public apiUrl = environment.dashUrl;
  public verifyEmail$ = new BehaviorSubject(null);

  async presentLoading(message?) {
    const loading = await this.loadingController.create({
      cssClass: 'loading-controller',
      message: (message) ? message : 'Cargando datos ...',
    });
    await loading.present();
  }

  dismissLoading() {
    setTimeout(() => {
      this.loadingController.dismiss();
    }, 500);
  }

  public getYears() {
    const years = [];
    const dateStart = moment();
    const dateEnd = moment().add(10, 'y');
    while (dateEnd.diff(dateStart, 'years') >= 0) {
      years.push(dateStart.format('YYYY'));
      dateStart.add(1, 'year');
    }
    return years;
  }
}

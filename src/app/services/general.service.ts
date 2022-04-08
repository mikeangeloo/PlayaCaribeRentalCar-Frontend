import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import {BehaviorSubject, map, Observable} from 'rxjs';
import { environment } from '../../environments/environment';
import {SweetMessagesService} from "./sweet-messages.service";
import * as moment from 'moment';
import {ToastMessageService} from "./toast-message.service";
import {ContratoI} from "../interfaces/contratos/contrato.interface";

@Injectable({
  providedIn: 'root',
})
export class GeneralService {
  //#endregion
  isLoading = false;
  public dashURL = environment.dashUrl;
  public apiUrl = environment.dashUrl;
  public verifyEmail$ = new BehaviorSubject(null)
  public dragObjStorageKey = 'dragObjs';
  //#region Atributos
  constructor(
    public loadingController: LoadingController,
    public httpClient: HttpClient,
    public router: Router,
    public sweetServ: SweetMessagesService,
    public toastServ: ToastMessageService,
    ) {}



  async presentLoading(message?) {
    const loading = await this.loadingController.create({
      cssClass: 'loading-controller',
      message: (message) ? message : 'Cargando datos ...',
    });
    await loading.present();
    this.isLoading = true;
  }

  dismissLoading() {
    setTimeout(() => {
      this.loadingController.dismiss();
      this.isLoading = false;
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

  public getList(endpoint, payload?): Observable<any> {
    return this.httpClient.get<any>(`${this.dashURL}/${endpoint}/list`, {params: payload}).pipe(map(response => {
      return response;
    }));
  }

  public copyClickBoard(data) {
    navigator.clipboard.writeText(data);
    this.toastServ.presentToast('info', 'Copiado al portapapeles', 'middle');
  }


}

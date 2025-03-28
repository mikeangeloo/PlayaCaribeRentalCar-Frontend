import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {NavController} from '@ionic/angular';
import {map, Observable} from 'rxjs';
import {DateConv} from '../helpers/date-conv';

@Injectable({
  providedIn: 'root'
})
export class PolizasService {


  // region Atributos
  public dashURL: string;
  public profile: any;
  public globalURL = environment.globalUrl;

  // endregion

  // region Constructor
  constructor(
    public httpClient: HttpClient,
    public navCtrl: NavController
  ) {
    this.dashURL = environment.dashUrl;
  }

  // endregion

  public getAll(): Observable<any> {
    return this.httpClient.get<any>(`${this.dashURL}/polizas/all`).pipe(map(response => {
      return response;
    }));
  }

  public getActive(): Observable<any> {
    return this.httpClient.get<any>(`${this.dashURL}/polizas`).pipe(map(response => {
      return response;
    }));
  }

  public getDataById(id): Observable<any> {
    return this.httpClient.get<any>(`${this.dashURL}/polizas/${id}`).pipe(map(response => {
      return response;
    }));
  }

  public saveUpdate(data, id?): Observable<any> {
    if (data.fecha_inicio) {
      data.fecha_inicio = DateConv.transFormDate(data.fecha_inicio, 'regular')
    }
    if (data.fecha_fin) {
      data.fecha_fin = DateConv.transFormDate(data.fecha_fin, 'regular')
    }
    if (id && id > 0) {
      return this.httpClient.put<any>(`${this.dashURL}/polizas/${id}`, data).pipe(map(response => {
        return response;
      }));
    } else {
      return this.httpClient.post<any>(`${this.dashURL}/polizas`, data).pipe(map(response => {
        return response;
      }));
    }
  }

  public setInactive(id): Observable<any> {
    return this.httpClient.delete<any>(`${this.dashURL}/polizas/${id}`).pipe(map(response => {
      return response;
    }));
  }

  public setEnable(id): Observable<any> {
    return this.httpClient.get<any>(`${this.dashURL}/polizas/enable/${id}`).pipe(map(response => {
      return response;
    }));
  }
}

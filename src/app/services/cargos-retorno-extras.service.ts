import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {NavController} from "@ionic/angular";
import {map, Observable} from "rxjs";
import { CargosExtrasI } from '../interfaces/configuracion/cargos-extras.interface';

@Injectable({
  providedIn: 'root'
})
export class CargosRetornoExtrasService {


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
    return this.httpClient.get<any>(`${this.dashURL}/cargos-extras/all`).pipe(map(response => {
      return response;
    }));
  }

  public async getActive() {
    try {
      let res = await this.httpClient.get<any>(`${this.dashURL}/cargos-extras`).toPromise();
      if (res.ok) {
        return {ok: true, data: res.datas as CargosExtrasI[]}
      }
    } catch (e) {
      return {ok: false, errors: e}
    }
  }

  public getDataById(id): Observable<any> {
    return this.httpClient.get<any>(`${this.dashURL}/cargos-extras/${id}`).pipe(map(response => {
      return response;
    }));
  }

  public saveUpdate(data, id?): Observable<any> {
    if (id && id > 0) {
      return this.httpClient.put<any>(`${this.dashURL}/cargos-extras/${id}`, data).pipe(map(response => {
        return response;
      }));
    } else {
      return this.httpClient.post<any>(`${this.dashURL}/cargos-extras`, data).pipe(map(response => {
        return response;
      }));
    }
  }

  public setInactive(id): Observable<any> {
    return this.httpClient.delete<any>(`${this.dashURL}/cargos-extras/${id}`).pipe(map(response => {
      return response;
    }));
  }

  public setEnable(id): Observable<any> {
    return this.httpClient.get<any>(`${this.dashURL}/cargos-extras/enable/${id}`).pipe(map(response => {
      return response;
    }));
  }
}

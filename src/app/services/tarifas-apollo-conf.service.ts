import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {NavController} from "@ionic/angular";
import {map, Observable} from "rxjs";
import {TarifaApolloConfI} from '../interfaces/tarifas/tarifa-apollo-conf.interface';

@Injectable({
  providedIn: 'root'
})
export class TarifasApolloConfService {


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
    return this.httpClient.get<any>(`${this.dashURL}/tarifas-apollo-conf/all`).pipe(map(response => {
      return response;
    }));
  }

  public getActive(): Observable<any> {
    return this.httpClient.get<any>(`${this.dashURL}/tarifas-apollo-conf`).pipe(map(response => {
      return response;
    }));
  }

  public async _getActive() {
    try {
      let res = await this.httpClient.get<any>(`${this.dashURL}/tarifas-apollo-conf`).toPromise();
      if (res.ok) {
        return {ok: true, data: res.data as TarifaApolloConfI[]}
      }
    } catch (e) {
      return {ok: false, errors: e}
    }
  }

  public getDataById(id): Observable<any> {
    return this.httpClient.get<any>(`${this.dashURL}/tarifas-apollo-conf/${id}`).pipe(map(response => {
      return response;
    }));
  }

  public saveUpdate(data, id?): Observable<any> {
    if (id && id > 0) {
      return this.httpClient.put<any>(`${this.dashURL}/tarifas-apollo-conf/${id}`, data).pipe(map(response => {
        return response;
      }));
    } else {
      return this.httpClient.post<any>(`${this.dashURL}/tarifas-apollo-conf`, data).pipe(map(response => {
        return response;
      }));
    }
  }

  public setInactive(id): Observable<any> {
    return this.httpClient.delete<any>(`${this.dashURL}/tarifas-apollo-conf/${id}`).pipe(map(response => {
      return response;
    }));
  }

  public setEnable(id): Observable<any> {
    return this.httpClient.get<any>(`${this.dashURL}/tarifas-apollo-conf/enable/${id}`).pipe(map(response => {
      return response;
    }));
  }
}

import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {NavController} from "@ionic/angular";
import {map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class EmpresasService {

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
    return this.httpClient.get<any>(`${this.dashURL}/empresas/all`).pipe(map(response => {
      return response;
    }));
  }

  public getActive() {
    return this.httpClient.get<any>(`${this.dashURL}/empresas`).toPromise();
  }

  public getDataById(empresa_id): Observable<any> {
    return this.httpClient.get<any>(`${this.dashURL}/empresas/${empresa_id}`).pipe(map(response => {
      return response;
    }));
  }

  public saveUpdate(empresaData, empresa_id?): Observable<any> {
    if (empresa_id && empresa_id > 0) {
      return this.httpClient.put<any>(`${this.dashURL}/empresas/${empresa_id}`, empresaData).pipe(map(response => {
        return response;
      }));
    } else {
      return this.httpClient.post<any>(`${this.dashURL}/empresas`, empresaData).pipe(map(response => {
        return response;
      }));
    }
  }

  public setInactive(empresa_id): Observable<any> {
    return this.httpClient.delete<any>(`${this.dashURL}/empresas/${empresa_id}`).pipe(map(response => {
      return response;
    }));
  }

  public setEnable(empresa_id): Observable<any> {
    return this.httpClient.get<any>(`${this.dashURL}/empresas/enable/${empresa_id}`).pipe(map(response => {
      return response;
    }));
  }
}

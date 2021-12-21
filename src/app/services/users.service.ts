import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {NavController} from "@ionic/angular";
import {map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UsersService {

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
    return this.httpClient.get<any>(`${this.dashURL}/usuarios/all`).pipe(map(response => {
      return response;
    }));
  }

  public getDataById(id): Observable<any> {
    return this.httpClient.get<any>(`${this.dashURL}/usuarios/${id}`).pipe(map(response => {
      return response;
    }));
  }

  public saveUpdate(data, id?): Observable<any> {
    if (id && id > 0) {
      return this.httpClient.put<any>(`${this.dashURL}/usuarios/${id}`, data).pipe(map(response => {
        return response;
      }));
    } else {
      return this.httpClient.post<any>(`${this.dashURL}/usuarios`, data).pipe(map(response => {
        return response;
      }));
    }
  }

  public setInactive(id): Observable<any> {
    return this.httpClient.delete<any>(`${this.dashURL}/usuarios/${id}`).pipe(map(response => {
      return response;
    }));
  }

  public setEnable(id): Observable<any> {
    return this.httpClient.get<any>(`${this.dashURL}/usuarios/enable/${id}`).pipe(map(response => {
      return response;
    }));
  }

  public changePsw(payload): Observable<any> {
    return this.httpClient.post<any>(`${this.dashURL}/usuarios/change-psw`, payload).pipe(map(response => {
      return response;
    }));
  }
}

import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {NavController} from "@ionic/angular";
import {map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HotelesService {

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
    return this.httpClient.get<any>(`${this.dashURL}/hoteles/all`).pipe(map(response => {
      return response;
    }));
  }

  public getActive() {
    return this.httpClient.get<any>(`${this.dashURL}/hoteles`).toPromise();
  }

  public getDataById(hotel_id): Observable<any> {
    return this.httpClient.get<any>(`${this.dashURL}/hoteles/${hotel_id}`).pipe(map(response => {
      return response;
    }));
  }

  public saveUpdate(hotelData, hotel_id?): Observable<any> {
    if (hotel_id && hotel_id > 0) {
      return this.httpClient.put<any>(`${this.dashURL}/hoteles/${hotel_id}`, hotelData).pipe(map(response => {
        return response;
      }));
    } else {
      return this.httpClient.post<any>(`${this.dashURL}/hoteles`, hotelData).pipe(map(response => {
        return response;
      }));
    }
  }

  public setInactive(hotel_id): Observable<any> {
    return this.httpClient.delete<any>(`${this.dashURL}/hoteles/${hotel_id}`).pipe(map(response => {
      return response;
    }));
  }

  public setEnable(hotel_id): Observable<any> {
    return this.httpClient.get<any>(`${this.dashURL}/hoteles/enable/${hotel_id}`).pipe(map(response => {
      return response;
    }));
  }
}

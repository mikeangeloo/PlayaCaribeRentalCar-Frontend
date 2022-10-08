import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {NavController} from '@ionic/angular';
import {map, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

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

  public getEstatusVehiculosReport(): Observable<any> {
    return this.httpClient.get<any>(`${this.dashURL}/reportes/estatus-vehiculos`).pipe(map(response => {
      return response;
    }));
  }

  public getMantenimientoVehiculosReport(): Observable<any> {
    return this.httpClient.get<any>(`${this.dashURL}/reportes/mantenimiento-vehiculos`).pipe(map(response => {
      return response;
    }));
  }
  public getVehiculosPoliza(): Observable<any> {
    return this.httpClient.get<any>(`${this.dashURL}/reportes/polizas-seguros`).pipe(map(response => {
      return response;
    }));
  }

  public getExedenteKilometrajeGasolina(): Observable<any> {
    return this.httpClient.get<any>(`${this.dashURL}/reportes/exedente-kilometraje-gasolina`).pipe(map(response => {
      return response;
    }));
  }

  public getReportePagos(): Observable<any> {
    return this.httpClient.get<any>(`${this.dashURL}/reportes/detalle-pagos`).pipe(map(response => {
      return response;
    }));
  }

  public getReporteRentasPorVehiculo(): Observable<any> {
    return this.httpClient.get<any>(`${this.dashURL}/reportes/rentas-por-vehiculo`).pipe(map(response => {
      return response;
    }));
  }

  public getReporteRentasPorComisionista(payload?): Observable<any> {
    return this.httpClient.post<any>(`${this.dashURL}/reportes/rentas-comisionistas`, payload).pipe(map(response => {
      return response;
    }));
  }

}

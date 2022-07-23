import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {NavController} from "@ionic/angular";
import {map, Observable} from "rxjs";
import {ContratoI} from "../interfaces/contratos/contrato.interface";

@Injectable({
  providedIn: 'root'
})
export class ContratosService {

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

  public saveProgress(_payload): Observable<any> {
    return this.httpClient.post<any>(`${this.dashURL}/contratos/save-progress`, _payload).pipe(map(response => {
      return response;
    }));
  }


  public getContractData(_id): Observable<any> {
    return this.httpClient.get<any>(`${this.dashURL}/contratos/${_id}`).pipe(map(response => {
      return response;
    }));
  }

  public sendAndGeneratePDF(_id) {
    // @ts-ignore
    return this.httpClient.get<any>(`${this.dashURL}/contratos/pdf/${_id}`, {responseType: 'blob'}).pipe(map(response => {
      return response;
    }));
  }

  public sendAndGenerateReservaPDF(_id) {
    // @ts-ignore
    return this.httpClient.get<any>(`${this.dashURL}/reservas/pdf/${_id}`, {responseType: 'blob'}).pipe(map(response => {
      return response;
    }));
  }

  public viewPDF(_id, estatus) {
    if(estatus == 4) {
      // @ts-ignore
      return this.httpClient.get<any>(`${this.dashURL}/reservas/view/pdf/${_id}`, {responseType: 'blob'}).pipe(map(response => {
        return response;
      }));
    } else {
      // @ts-ignore
      return this.httpClient.get<any>(`${this.dashURL}/contratos/view/pdf/${_id}`, {responseType: 'blob'}).pipe(map(response => {
        return response;
      }));
    }

  }

  public cancelContract(_id) {
    return this.httpClient.delete<any>(`${this.dashURL}/contratos/cancel/${_id}`).pipe(map(response => {
      return response;
    }))
  }

  public async _getContractData(_id) {
    try {
      let res = await this.httpClient.get<any>(`${this.dashURL}/contratos/${_id}`).toPromise();
      if (res.ok) {
        return {ok: true, data: res.data}
      }
    } catch (e) {
      return {ok: false, errors: e}
    }
  }

  public async getReservas() {
    try {
      let res = await this.httpClient.get<any>(`${this.dashURL}/reservas`).toPromise();
      if (res.ok) {
        return {ok: true, data: res.reservas}
      }
    } catch (e) {
      return {ok: false, errors: e}
    }
  }

  public getContractNumber(): string {
    const _data = localStorage.getItem('num_contrato');
    if (_data != 'undefined') {
      return _data;
    } else {
      return null;
    }
  }

  public getReservaContractNumber(): string {
    const _data = localStorage.getItem('num_reserva');
    if (_data != 'undefined') {
      return _data;
    } else {
      return null;
    }
  }

  public setContractData(num_contrato) {
    localStorage.setItem('num_contrato', num_contrato);
  }

  public setReservaData(num_reserva) {
    localStorage.setItem('num_reserva', num_reserva);
  }

  public flushContractData() {
    localStorage.removeItem('num_contrato');
  }

  public flushReservaData() {
    localStorage.removeItem('num_reserva');
  }

  public getContractTypePrefix(num_contrato: string): { type: string, prefix: string } {
    let prefix = num_contrato.substr(0, 2);
    let type = '';
    if (prefix === 'AP') {
      type = 'contrato'
    } else if (prefix === 'RS') {
      type = 'reserva'
    }
    return {type, prefix}
  }
}

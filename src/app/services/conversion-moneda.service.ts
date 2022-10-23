import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {AlertController, NavController} from '@ionic/angular';
import {lastValueFrom, map, Observable} from 'rxjs';
import {TiposCambioI} from '../interfaces/configuracion/tipos-cambio';
import {DivisasI} from '../interfaces/configuracion/divisas.interface';

@Injectable({
  providedIn: 'root'
})
export class ConversionMonedaService {

  // region Atributos
  public dashURL: string;
  public profile: any;
  public globalURL = environment.globalUrl;

  public tiposCambio: TiposCambioI[] = [];
  public tipoCambio: TiposCambioI;

  public divisas: DivisasI[] = [];

  // endregion

  // region Constructor
  constructor(
    public httpClient: HttpClient,
    public navCtrl: NavController,
    private alertCtrl: AlertController
  ) {
    this.dashURL = environment.dashUrl;

    this.loadDivisas();
  }

  // endregion

  public getAllTiposCambio(): Observable<any> {
    return this.httpClient.get<any>(`${this.dashURL}/tipo-cambio/all`).pipe(map(response => {
      return response;
    }));
  }

  public getAllHistory(): Observable<any> {
    return this.httpClient.get<any>(`${this.dashURL}/tipo-cambio/all-history`).pipe(map(response => {
      return response;
    }));
  }

  public getDataById(payload): Observable<any> {
    return this.httpClient.post<any>(`${this.dashURL}/tipo-cambio`, payload).pipe(map(response => {
      return response;
    }));
  }

  public save(data): Observable<any> {
    return this.httpClient.post<any>(`${this.dashURL}/tipo-cambio/save`, data).pipe(map(response => {
      return response;
    }));
  }

  public getAllDivisas(): Observable<any> {
    return this.httpClient.get<any>(`${this.dashURL}/tipo-cambio/divisas`).pipe(map(response => {
      return response;
    }));
  }

  public deleteTipoCambio(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.dashURL}/tipo-cambio/${id}`).pipe(map(response => {
      return response;
    }));
  }




  async loadTiposCambios() {
    let res = await lastValueFrom(this.getAllTiposCambio());
    if (res.ok) {
      this.tiposCambio = res.data
      this.tipoCambio = this.tiposCambio[0]
    }
  }

  async tipoCambioOpts() {
    let inputs = [];
    for (let tipoCambio of this.tiposCambio) {
      inputs.push({
        label: `1 ${tipoCambio.divisa_base} = ${tipoCambio.tipo_cambio} ${tipoCambio.divisa_conversion}`,
        type: 'radio',
        value: tipoCambio.id
      })
    }
    const alert = await this.alertCtrl.create({
      subHeader: 'Tipos de Cambio',
      buttons: ['OK'],
      inputs
    });

    await alert.present();

    let {data} = await alert.onDidDismiss();
    if (data?.values) {
      console.log('data --->', data)
      this.tipoCambio = this.tiposCambio.find(tipo => tipo.id === data.values)
    }

  }

  async loadDivisas() {
    let res = await lastValueFrom(this.getAllDivisas());
    if (res.ok) {
      this.divisas = res.data;
    }
  }

}

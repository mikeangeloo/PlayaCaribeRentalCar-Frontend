import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {NavController} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class CobranzaService {

  // region Atributos
  public dashURL: string;
  public profile: any;
  public globalURL = environment.globalUrl;

  // endregion
  constructor(
      public httpClient: HttpClient,
      public navCtrl: NavController
  ) {
    this.dashURL = environment.dashUrl;
  }


  public async cancelCobro(payload) {
    try {
      let res = await this.httpClient.post<any>(`${this.dashURL}/cobranza/cancel`, payload).toPromise();
      if (res.ok) {
        return {ok: true, message: res.message}
      }
    } catch (e) {
      return {ok: false, errors: e}
    }
  }
}

import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {NavController} from '@ionic/angular';
import {map, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilesService {

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

  public async storeDocs(_payload) {
    try {
      const query = await this.httpClient.post<any>(`${this.dashURL}/files/store-docs`, _payload).toPromise();
      if (query.ok) {
        return {ok: true, payload: query.payload}
      }
    } catch (e) {
      return {ok: false, error: e}
    }
  }

  public async getDocs(_payload) {
    try {
      const query = await this.httpClient.post<any>(`${this.dashURL}/files/get-docs`, _payload).toPromise();
      if (query.ok) {
        return {ok: true, data: query.data}
      }
    } catch (e) {
      return {ok: false, error: e}
    }
  }

  public async deleteDoc(_payload) {
    try {
      const query = await this.httpClient.post<any>(`${this.dashURL}/files/delete`, _payload).toPromise();
      if (query.ok) {
        return {ok: true, data: query}
      }
    } catch (e) {
      return {ok: false, error: e}
    }
  }


}

import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {NavController} from '@ionic/angular';
import {map, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotasService {

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


  saveUpdate(note, model_id, model, id?): Observable<any> {
    let payload = {
      id,
      nota: note,
      modelo_id: model_id,
      modelo: model
    }
    return this.httpClient.post<any>(`${this.dashURL}/notas/save`, payload).pipe(map(res => {
      return res;
    }));
  }

  inactive(id): Observable<any> {
    return this.httpClient.get<any>(`${this.dashURL}/notas/delete/${id}`).pipe(map(res => {
      return;
    }));
  }
}

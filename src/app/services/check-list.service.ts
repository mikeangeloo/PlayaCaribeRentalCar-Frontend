import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {NavController} from '@ionic/angular';
import {map, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckListService {

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

  showInfo(id): Observable<any> {
    return this.httpClient.get<any>(`${this.dashURL}/check-list/${id}`).pipe(map(res => {
      return res;
    }));
  }

  remove(id): Observable<any> {
    return this.httpClient.get<any>(`${this.dashURL}/check-list/delete/${id}`).pipe(map(res => {
      return res;
    }));
  }
}

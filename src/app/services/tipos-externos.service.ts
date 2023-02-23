import { Injectable } from '@angular/core';
import {map, Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {NavController} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class TiposExternosService {

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

  public getActive(): Observable<any> {
    return this.httpClient.get<any>(`${this.dashURL}/tipos-externos`).pipe(map(response => {
      return response;
    }));
  }
}

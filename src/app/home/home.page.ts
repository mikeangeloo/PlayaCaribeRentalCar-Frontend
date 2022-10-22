import { Component } from '@angular/core';
import {GeneralService} from '../services/general.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(
    private generalServ: GeneralService
  ) {}

  ionViewWillEnter() {
    this.generalServ.headerTitle = 'Dashboard'
  }

  ionViewWillLeave() {
    this.generalServ.headerTitle = ''
  }
}

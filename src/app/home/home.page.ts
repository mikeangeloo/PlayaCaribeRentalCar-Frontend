import { Component } from '@angular/core';
import {ModalController} from '@ionic/angular';
import {CobroDepositoModalComponent} from '../common/components/cobro-deposito-modal/cobro-deposito-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(
    private modalCtrl: ModalController
  ) {}

  async openDemoModal() {
    const modal = await this.modalCtrl.create({
      component: CobroDepositoModalComponent,
      componentProps: {
        'asModal': true,
        'balanceCobro': 4000,
        'cobranza_id': 1
      },
      swipeToClose: true,
      cssClass: 'large-form'
    })

    await modal.present()
    const {data} = await modal.onDidDismiss();
    console.log(data)
  }
}

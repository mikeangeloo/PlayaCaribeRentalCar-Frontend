import { Component, OnInit } from '@angular/core';
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'app-sucursales',
  templateUrl: './sucursales.page.html',
  styleUrls: ['./sucursales.page.scss'],
})
export class SucursalesPage implements OnInit {

  constructor(
    public modalCtrl: ModalController,
  ) { }

  ngOnInit() {
  }

  dismiss() {
    this.modalCtrl.dismiss({
    });
  }

}

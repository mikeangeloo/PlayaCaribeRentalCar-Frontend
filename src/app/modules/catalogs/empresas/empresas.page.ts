import { Component, OnInit } from '@angular/core';
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'app-empresas',
  templateUrl: './empresas.page.html',
  styleUrls: ['./empresas.page.scss'],
})
export class EmpresasPage implements OnInit {

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

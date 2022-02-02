import { Component, OnInit } from '@angular/core';
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'app-empresas',
  templateUrl: './listado-hoteles.page.html',
  styleUrls: ['./listado-hoteles.page.scss'],
})
export class ListadoHotelesPage implements OnInit {

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

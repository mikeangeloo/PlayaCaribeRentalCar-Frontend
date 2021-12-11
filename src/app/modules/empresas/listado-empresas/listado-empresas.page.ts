import { Component, OnInit } from '@angular/core';
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'app-empresas',
  templateUrl: './listado-empresas.page.html',
  styleUrls: ['./listado-empresas.page.scss'],
})
export class ListadoEmpresasPage implements OnInit {

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

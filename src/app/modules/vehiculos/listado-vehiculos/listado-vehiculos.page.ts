import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-listado-vehiculos',
  templateUrl: './listado-vehiculos.page.html',
  styleUrls: ['./listado-vehiculos.page.scss'],
})
export class ListadoVehiculosPage implements OnInit {

  data = null;
  constructor() { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.data = null;
  }

  ionViewWillLeave() {
    this.data = [];
  }

}

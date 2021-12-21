import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-vehiculos',
  templateUrl: './vehiculos.page.html',
  styleUrls: ['./vehiculos.page.scss'],
})
export class VehiculosPage implements OnInit {

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

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mantenimiento-vehiculos',
  templateUrl: './mantenimiento-vehiculos.component.html',
  styleUrls: ['./mantenimiento-vehiculos.component.scss'],
})
export class MantenimientoVehiculosComponent implements OnInit {

  enterView: boolean;
  constructor() { }

  ngOnInit() {}

  ionViewWillEnter() {
    this.enterView = true
  }

  ionViewWillLeave() {
    this.enterView = false
  }

}

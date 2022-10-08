import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rentas-por-vehiculo',
  templateUrl: './rentas-por-vehiculo.component.html',
  styleUrls: ['./rentas-por-vehiculo.component.scss'],
})
export class RentasPorVehiculoComponent implements OnInit {

  enterView: boolean
  constructor() { }

  ngOnInit() {}

  ionViewWillEnter() {
    this.enterView = true
  }

  ionViewDidLeave() {
    this.enterView = false
  }

}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reporte-general-vehiculo',
  templateUrl: './reporte-general.component.html',
  styleUrls: ['./reporte-general.component.scss'],
})
export class ReporteGeneralComponent implements OnInit {

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

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-detalle-pagos',
  templateUrl: './detalle-pagos.component.html',
  styleUrls: ['./detalle-pagos.component.scss'],
})
export class DetallePagosComponent implements OnInit {

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

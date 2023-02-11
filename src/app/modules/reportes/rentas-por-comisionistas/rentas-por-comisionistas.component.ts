import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rentas-por-comisionistas',
  templateUrl: './rentas-por-comisionistas.component.html',
  styleUrls: ['./rentas-por-comisionistas.component.scss'],
})
export class RentasPorComisionistasComponent implements OnInit {

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

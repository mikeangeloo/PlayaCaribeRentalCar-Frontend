import { Component, OnInit } from '@angular/core';
import {ConversionMonedaService} from '../../../services/conversion-moneda.service';


@Component({
  selector: 'app-tipos-cambio-indicador',
  templateUrl: './tipos-cambio-indicador.component.html',
  styleUrls: ['./tipos-cambio-indicador.component.scss'],
})
export class TiposCambioIndicadorComponent implements OnInit {

  constructor(
    private convMonedaServ: ConversionMonedaService
  ) { }

  async ngOnInit() {
    await this.convMonedaServ.loadTiposCambios();

  }

}

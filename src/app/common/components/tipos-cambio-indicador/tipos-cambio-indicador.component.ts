import { Component, OnInit } from '@angular/core';
import {ConversionMonedaService} from '../../../services/conversion-moneda.service';
import {SessionService} from '../../../services/session.service';


@Component({
  selector: 'app-tipos-cambio-indicador',
  templateUrl: './tipos-cambio-indicador.component.html',
  styleUrls: ['./tipos-cambio-indicador.component.scss'],
})
export class TiposCambioIndicadorComponent implements OnInit {

  constructor(
    public convMonedaServ: ConversionMonedaService,
    private sessionServ: SessionService
  ) { }

  async ngOnInit() {
    this.sessionServ.logged$.subscribe(async (logged) => {
      if (logged) {
        await this.convMonedaServ.loadTiposCambios();
      }
    })
  }
}

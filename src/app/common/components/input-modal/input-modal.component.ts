import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MarcasVehiculosI} from '../../../interfaces/catalogo-vehiculos/marcas-vehiculos.interface';
import {ModalController} from '@ionic/angular';
import {MarcasVehiculosService} from '../../../services/marcas-vehiculos.service';
import {GeneralService} from '../../../services/general.service';
import {SweetMessagesService} from '../../../services/sweet-messages.service';
import {ToastMessageService} from '../../../services/toast-message.service';
import {CobranzaTipo} from '../../../interfaces/cobranza/cobranza-prog.interface';
import {TiposCambioI} from '../../../interfaces/configuracion/tipos-cambio';
import {ConversionMonedaService} from '../../../services/conversion-moneda.service';

@Component({
  selector: 'app-input-modal',
  templateUrl: './input-modal.component.html',
  styleUrls: ['./input-modal.component.scss'],
})
export class InputModalComponent implements OnInit {

  @Input() asModal: boolean;
  @Input() montoCobrado: number;
  @Input() balanceCobro: number;
  @Input() cobranza_id: number;
  @Input() divisa_id: number = 1;

  public title: string;


  public converionSaldo: number;
  public tipoCambioTomado: TiposCambioI;

  constructor(
    public modalCtrl: ModalController,
    private sweetMsg: SweetMessagesService,
    private toastServ: ToastMessageService,
    public convMonedaServ: ConversionMonedaService
  ) {
  }

  ngOnInit() {
    this.title = 'Captura de efectivo';
    if (this.divisa_id && this.divisa_id !== 1) {
      this.handleDivisaChange();
    }
  }

  handleDivisaChange() {
    this.tipoCambioTomado = this.convMonedaServ.tiposCambio.find(tipoC => tipoC.divisa_base_id === this.divisa_id);
    if (this.tipoCambioTomado && this.tipoCambioTomado.divisa_base !== 'MXN') {
      this.converionSaldo = (this.balanceCobro / Number(this.tipoCambioTomado.tipo_cambio));
    } else {
      this.converionSaldo = null;
      this.tipoCambioTomado = {
        id: null,
        tipo_cambio: 1,
        divisa_base: 'MXN'
      };
    }
  }

  saveUpdate() {
    if (!this.cobranza_id && this.montoCobrado > this.balanceCobro) {
      this.sweetMsg.printStatus('El monto ingresado es mayor al balance por cobrar', 'warning');
      return;
    }
    let montoBase = this.montoCobrado;
    if (this.tipoCambioTomado && this.tipoCambioTomado.divisa_base !== 'MXN') {
      montoBase = (this.montoCobrado * Number(this.tipoCambioTomado.tipo_cambio));
    }
    this.dismiss(true, {monto: montoBase, monto_cobrado: this.montoCobrado, tipoCambio: this.tipoCambioTomado, divisaId: this.divisa_id});
  }

  dismiss(reload?, _data?) {
    this.modalCtrl.dismiss({
      reload,
      info: _data
    });
  }
}

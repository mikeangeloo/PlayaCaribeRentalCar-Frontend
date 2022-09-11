import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MarcasVehiculosI} from '../../../interfaces/catalogo-vehiculos/marcas-vehiculos.interface';
import {ModalController} from '@ionic/angular';
import {MarcasVehiculosService} from '../../../services/marcas-vehiculos.service';
import {GeneralService} from '../../../services/general.service';
import {SweetMessagesService} from '../../../services/sweet-messages.service';
import {ToastMessageService} from '../../../services/toast-message.service';
import {CobranzaTipo} from '../../../interfaces/cobranza/cobranza-prog.interface';

@Component({
  selector: 'app-input-modal',
  templateUrl: './input-modal.component.html',
  styleUrls: ['./input-modal.component.scss'],
})
export class InputModalComponent implements OnInit {

  @Input() asModal: boolean;
  @Input() monto: number;
  @Input() balanceCobro: number;
  @Input() cobranza_id: number;
  @Input() cobranzaTipo: CobranzaTipo;
  @Input() totalDeposito: number;
  public title: string;

  constructor(
    public modalCtrl: ModalController,
    private sweetMsg: SweetMessagesService,
    private toastServ: ToastMessageService
  ) {
  }

  ngOnInit() {
    if (this.cobranzaTipo === 'efectivo') {
      this.title = 'Captura de efectivo';
    } else if (this.cobranzaTipo === 'deposito') {
      this.title = 'Captura de deposito';
    }
  }

  saveUpdate() {
    if (this.cobranzaTipo === 'deposito') {
      if (!this.cobranza_id && this.monto > this.totalDeposito) {
        this.sweetMsg.printStatus('El monto ingresado es mayor al deposito disponible', 'warning');
        return;
      }
    }
    if (!this.cobranza_id && this.monto > this.balanceCobro) {
      this.sweetMsg.printStatus('El monto ingresado es mayor al balance por cobrar', 'warning');
      return;
    }
    this.dismiss(true, {monto: this.monto});
  }

  dismiss(reload?, _data?) {
    this.modalCtrl.dismiss({
      reload,
      info: _data
    });
  }
}

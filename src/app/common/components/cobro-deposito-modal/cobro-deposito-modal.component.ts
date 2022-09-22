import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {SweetMessagesService} from '../../../services/sweet-messages.service';
import {ToastMessageService} from '../../../services/toast-message.service';

interface CobranzaDepositoI {
  seccion: string
  num_contrato: string

  contrato_id: number
  cliente_id: number
  tarjeta_id: number
  monto: number
  moneda: string
  tipo: number
  cobranza_seccion: string
  cod_banco: string
}

@Component({
  selector: 'app-cobro-deposito-modal',
  templateUrl: './cobro-deposito-modal.component.html',
  styleUrls: ['./cobro-deposito-modal.component.scss'],
})
export class CobroDepositoModalComponent implements OnInit {

  @Input() asModal: boolean;
  @Input() balanceCobro: number;
  @Input() contrato_id: number;
  @Input() cliente_id: number;
  public title: string;

  public totalDeposito = 0;

  constructor(
    public modalCtrl: ModalController,
    private sweetMsg: SweetMessagesService,
    private toastServ: ToastMessageService
  ) {
    this.title = 'Cobranza de depósito';
  }

  ngOnInit() {}

  saveUpdate() {

  }

  dismiss(reload?, _data?) {
    this.modalCtrl.dismiss({
      reload,
      info: _data
    });
  }

}

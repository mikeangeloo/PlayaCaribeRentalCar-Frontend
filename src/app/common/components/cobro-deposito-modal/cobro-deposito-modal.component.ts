import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {SweetMessagesService} from '../../../services/sweet-messages.service';
import {ToastMessageService} from '../../../services/toast-message.service';
import {CobranzaService} from '../../../services/cobranza.service';
import {CobranzaTipoE} from '../../../enums/cobranza-tipo.enum';
import {CobranzaStatusEnum} from '../../../enums/cobranza-status.enum';
import {CobranzaCapturadaI} from '../../../interfaces/cobranza/cobranza-capturada.interface';
import {CobranzaSeccionEnum} from '../../../enums/cobranza-seccion.enum';
import {ContratoSeccionEnum} from '../../../enums/contrato-seccion.enum';

interface CobranzaDepositoI {
  c_type: string
  c_cn4: string
  c_monto: string

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
  cobranzaAuth_id: number

  errors?: string[];
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
  @Input() num_contrato: string;
  @Input() cliente_id: number;
  public title: string;

  public totalDeposito = 0;
  public cobranzaAuthCapturada: CobranzaCapturadaI[] = []
  public cobranzaDepositos: CobranzaDepositoI[] = []

  constructor(
    public modalCtrl: ModalController,
    private sweetMsg: SweetMessagesService,
    private toastServ: ToastMessageService,
    private cobroServ: CobranzaService
  ) {
    this.title = 'Cobranza de depósito';
  }

  async ngOnInit() {
    await this.loadCobranza()
  }

  saveUpdate() {
    console.log('cobro deposito --->', this.cobranzaDepositos);
  }

  async loadCobranza() {
    let payload = {
      contrato_id: this.contrato_id,
      cliente_id: this.cliente_id,
      tipo: CobranzaTipoE.PREAUTHORIZACION,
      estatus: CobranzaStatusEnum.COBRADO,
      cobranza_seccion: 'salida'
    }
    let res = await this.cobroServ.getCobranza(payload)
    if (res.ok) {
      this.cobranzaAuthCapturada = res['data']
      this.totalDeposito = res['total']
      console.log(res['total'])

      for(let cobranzaAuth of this.cobranzaAuthCapturada) {
        let cobranzaDeposito: CobranzaDepositoI = {
          c_type: cobranzaAuth.tarjeta?.c_type,
          c_cn4: cobranzaAuth.tarjeta?.c_cn4,
          c_monto: cobranzaAuth.monto,

          cliente_id: this.cliente_id,
          cobranza_seccion: CobranzaSeccionEnum.RETORNO,
          cod_banco: '',
          contrato_id: this.contrato_id,
          moneda: 'MXN',
          monto: null,
          num_contrato: this.num_contrato,
          seccion: ContratoSeccionEnum.COBRANZARETORNO,
          tarjeta_id: cobranzaAuth.tarjeta_id,
          tipo: CobranzaTipoE.PAGODEPOSITO,

          cobranzaAuth_id: cobranzaAuth.id,

          errors: []
        }
        this.cobranzaDepositos.push(cobranzaDeposito)
      }
    }
  }

  handleCobroCaptura(cobroD: CobranzaDepositoI) {
    if (cobroD?.monto > this.totalDeposito) {
      cobroD.errors.push('La captura a cobrar no puede ser mayor al deposito capturado de esta tarjeta');
    } else if (cobroD.monto > this.balanceCobro) {
      cobroD.errors.push('La captura a cobrar no puede ser mayor al balance por cobrar');
    } else {
      cobroD.errors = []
    }
  }

  dismiss(reload?, _data?) {
    this.modalCtrl.dismiss({
      reload,
      info: _data
    });
  }

}

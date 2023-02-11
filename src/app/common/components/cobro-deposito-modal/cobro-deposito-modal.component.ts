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
import {ContratosService} from '../../../services/contratos.service';
import {from, map, mergeMap} from 'rxjs';
import {ConversionMonedaService} from '../../../services/conversion-moneda.service';

interface CobranzaDepositoI {
  c_type: string
  c_cn4: string
  c_monto: number

  seccion: string
  num_contrato: string
  contrato_id: number
  cliente_id: number
  tarjeta_id: number
  tipo_cambio_id: number
  tipo_cambio: number
  monto: number
  monto_cobrado: number
  moneda: string
  moneda_cobrada: string
  tipo: number
  cobranza_seccion: string
  cod_banco: string
  cobranzaAuth_id: number
  cobroDeposito_id: number

  errors?: string[];
  conversionCobro: number;
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

  @Input() monedaCobro: string;

  public title: string;

  public totalDeposito = 0;
  public cobranzaAuthCapturada: CobranzaCapturadaI[] = []
  public cobranzaDepositos: CobranzaDepositoI[] = []


  constructor(
    public modalCtrl: ModalController,
    private sweetMsg: SweetMessagesService,
    private toastServ: ToastMessageService,
    private cobroServ: CobranzaService,
    private contratoServ: ContratosService,
    public convMonedaServ: ConversionMonedaService
  ) {
    this.title = 'Cobranza de depósito';
  }

  async ngOnInit() {
    await this.loadCobranza()
  }

  saveUpdate() {

    console.log('cobro deposito --->', this.cobranzaDepositos);
    from(this.cobranzaDepositos).pipe(
      map((payload) => {
        return this.contratoServ.saveProgress(payload).pipe(
          map((response) => {
            return {payload: payload, response: response}
          })
        )
      }),
      mergeMap((data) => data)
    ).subscribe((res) => {
      if (res.response.ok === true) {
        this.dismiss(true)
      }
    },error => {
      console.log(error)
      this.sweetMsg.printStatusArray(error.error.errors, 'error')
    })
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
      this.totalDeposito = res['totalDeposito']
      console.log(res['total'])

      for(let cobranzaAuth of this.cobranzaAuthCapturada) {
        let cobroDeposito = {
          cod_banco: '',
          monto: null,
          monto_cobrado: null,
          cobroDeposito_id: null,
          moneda: null,
          moneda_cobrada: null
        }
        if (cobranzaAuth.cobro_depositos && cobranzaAuth.cobro_depositos.length > 0) {
          let getDepositoData = this.findCobroDepositosOnData(cobranzaAuth.id, cobranzaAuth.tarjeta_id, cobranzaAuth.cobro_depositos)
          console.log(getDepositoData)
          if (getDepositoData) {
            cobroDeposito.cod_banco = getDepositoData.cod_banco;
            cobroDeposito.monto = getDepositoData.monto
            cobroDeposito.monto_cobrado = getDepositoData.monto_cobrado
            cobroDeposito.cobroDeposito_id = getDepositoData.id
            cobroDeposito.moneda = getDepositoData.moneda
            cobroDeposito.moneda_cobrada = getDepositoData.moneda_cobrada
          }
        }

        let cobranzaDeposito: CobranzaDepositoI = {
          c_type: cobranzaAuth.tarjeta?.c_type,
          c_cn4: cobranzaAuth.tarjeta?.c_cn4,
          c_monto: cobranzaAuth.monto_cobrado,

          cliente_id: this.cliente_id,
          cobranza_seccion: CobranzaSeccionEnum.RETORNO,
          cod_banco: cobroDeposito.cod_banco,
          contrato_id: this.contrato_id,
          moneda: cobranzaAuth.moneda,
          moneda_cobrada: cobranzaAuth.moneda_cobrada,
          monto: cobroDeposito.monto,
          monto_cobrado: cobroDeposito.monto_cobrado,
          num_contrato: this.num_contrato,
          seccion: ContratoSeccionEnum.COBRANZARETORNO,
          tarjeta_id: cobranzaAuth.tarjeta_id,
          tipo: CobranzaTipoE.PAGODEPOSITO,

          tipo_cambio: Number(cobranzaAuth.tipo_cambio),
          tipo_cambio_id: cobranzaAuth.tipo_cambio_id,

          cobranzaAuth_id: cobranzaAuth.id,
          cobroDeposito_id: cobroDeposito.cobroDeposito_id,

          errors: [],

          conversionCobro: 0
        }
        this.cobranzaDepositos.push(cobranzaDeposito)
        this.handleCobroCaptura(cobranzaDeposito)
      }
    }
  }

  handleCobroCaptura(cobroD: CobranzaDepositoI) {

    if (cobroD.tipo_cambio) {
      cobroD.conversionCobro = Number((cobroD.monto_cobrado * cobroD.tipo_cambio).toFixed(2))
      cobroD.monto = cobroD.conversionCobro
    } else {
      cobroD.conversionCobro = Number((cobroD.monto_cobrado).toFixed(2))
      cobroD.monto = cobroD.conversionCobro
    }


    if (cobroD?.conversionCobro > this.totalDeposito) {
      cobroD.errors.push('La captura a cobrar no puede ser mayor al deposito capturado de esta tarjeta');
    } else if (cobroD.conversionCobro > this.balanceCobro) {
      cobroD.errors.push('La captura a cobrar no puede ser mayor al balance por cobrar');
    } else {
      cobroD.errors = []
    }
  }

  canSave():boolean {
    return this.cobranzaDepositos.some(x => x.errors?.length > 0)
  }

  dismiss(reload?, _data?) {
    this.modalCtrl.dismiss({
      reload,
      info: _data
    });
  }

  private findCobroDepositosOnData(preAuthId: number, tarjeta_id: number, cobro: CobranzaCapturadaI[]): CobranzaCapturadaI {
    return cobro.filter((cobro) => cobro.tarjeta_id === tarjeta_id && cobro.cobranza_id === preAuthId).pop()
  }

}

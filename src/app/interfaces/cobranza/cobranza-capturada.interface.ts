import {CardI} from '../cards/card.interface';
import {CobranzaTipoE} from '../../enums/cobranza-tipo.enum';

export interface CobranzaCapturadaI
{
  id: number;
  contrato_id: number;
  cobranza_id?: number;
  tarjeta_id: number;
  cliente_id: number;
  fecha_cargo: string;
  tipo_cambio_id: number;
  tipo_cambio: number;
  monto: string;
  monto_cobrado: number;
  moneda: string;
  moneda_cobrada: string;
  tipo: number;
  cobranza_seccion: string;
  estatus: number;
  fecha_procesado: string;
  cod_banco: string;
  res_banco?: any;
  fecha_reg: string;
  created_at: Date;
  updated_at: Date;
  tarjeta: CardI;
  cobro_depositos?: CobranzaCapturadaI[]
}

export class CobranzaCapturada
{
  id: number;
  contrato_id: number;
  cobranza_id?: number;
  tarjeta_id: number;
  cliente_id: number;
  fecha_cargo: string;
  tipo_cambio_id: number;
  tipo_cambio: number;
  monto: string;
  monto_cobrado: string;
  moneda: string;
  moneda_cobrada: string;
  tipo_id: number;
  tipo: string;
  cobranza_seccion: string;
  estatus: number;
  fecha_procesado: string;
  cod_banco: string;
  res_banco?: any;
  fecha_reg: string;
  created_at: string;
  updated_at: string;
  tarjeta: Tarjeta

  constructor(data: any) {
    this.id = data.id
    this.contrato_id = data.contrato_id
    this.cobranza_id = data.cobranza_id
    this.tarjeta_id = data.tarjeta_id
    this.cliente_id = data.cliente_id
    this.fecha_cargo = data.fecha_cargo
    this.tipo_cambio_id = data.tipo_cambio_id
    this.tipo_cambio = data.tipo_cambio
    this.monto = data.monto
    this.monto_cobrado = data.monto_cobrado
    this.moneda = data.moneda
    this.moneda_cobrada = data.moneda_cobrada
    this.tipo_id = data.tipo
    this.tipo = this.getTipo(data.tipo)
    this.cobranza_seccion = data.cobranza_seccion
    this.estatus = data.estatus
    this.fecha_procesado = data.fecha_procesado
    this.cod_banco = data.cod_banco
    this.res_banco = data.res_banco
    this.fecha_reg = data.fecha_reg
    this.created_at = data.created_at
    this.updated_at = data.updated_at
    this.tarjeta = new Tarjeta(data.tarjeta)
  }

  getTipo(tipo_id: number) {
    if (tipo_id === CobranzaTipoE.PAGODEPOSITO) {
      return 'DEPOSITO'
    } else if (tipo_id === CobranzaTipoE.PREAUTHORIZACION) {
      return 'PRE-AUTORIZACIÓN'
    } else if (tipo_id === CobranzaTipoE.PAGOEFECTIVO) {
      return 'EFECTIVO'
    } else if (tipo_id === CobranzaTipoE.PAGOTARJETA) {
      return 'TARJETA'
    }
  }
}

export class Tarjeta
{
  id: number
  c_type: string
  c_charge_method: number
  c_cn1: string
  c_cn4: string
  c_month: string
  c_year: string

  constructor(data: any) {
    this.id = data?.id
    this.c_type = data?.c_type
    this.c_charge_method = data?.c_charge_method
    this.c_cn1 = data?.c_cn1
    this.c_cn4 = data?.c_cn4
    this.c_month = data?.c_month
    this.c_year = data?.c_year
  }
}

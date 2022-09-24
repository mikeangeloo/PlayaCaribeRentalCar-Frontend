import {CardI} from '../cards/card.interface';

export interface CobranzaCapturadaI
{
  id: number;
  contrato_id: number;
  tarjeta_id: number;
  cliente_id: number;
  fecha_cargo: string;
  monto: string;
  moneda: string;
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
}

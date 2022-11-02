import {CobranzaCapturadaI} from '../../../../../interfaces/cobranza/cobranza-capturada.interface';

export interface ReporteEndpointI {
  id: number;
  created_at: string;
  fecha_salida: string;
  hora_salida: string;
  fecha_retorno: string;
  hora_retorno: string;
  num_contrato: string;
  num_reserva?: string;
  ub_salida_id: number;
  ub_retorno_id: number;
  vehiculo_id: number;
  user_create_id: number;
  user_close_id: number;
  total_salida: string;
  total_retorno: string;
  cliente_id: number;
  km_inicial: number;
  km_final: number;
  cant_combustible_salida: string;
  cant_combustible_retorno: string;
  estatus: number;
  cobranza_tarjeta_mxn?: {
    total: number,
    data: CobranzaCapturadaI[]
  };
  cobranza_tarjeta_usd?: {
    total: number,
    data: CobranzaCapturadaI[]
  };
  cobranza_efectivo_mxn: {
    total: number,
    data: CobranzaCapturadaI[]
  };
  cobranza_efectivo_usd?: {
    total: number,
    data: CobranzaCapturadaI[]
  };
  cobranza_pre_auth_mxn: {
    total: number,
    data: CobranzaCapturadaI[]
  };
  cobranza_pre_auth_usd?: {
    total: number,
    data: CobranzaCapturadaI[]
  };
  cobranza_deposito_mxn: {
    total: number,
    data: CobranzaCapturadaI[]
  };
  cobranza_deposito_usd?: {
    total: number,
    data: CobranzaCapturadaI[]
  };
  total_final: number;
  total_cobrado_mxn: number;
  total_cobrado_usd: number;
  salida?: {
    id: number;
    alias: string;
  };
  retorno?: {
    id: number;
    alias: string;
  };
  vehiculo?: {
    id: number;
    modelo: string;
    modelo_ano: string;
    placas: string;
    color: string;

  };
  cliente?: {
    id: number;
    nombre: string;
    telefono: string;
    num_licencia: string;
    licencia_mes: string;
    licencia_ano: string;
    email: string;
    direccion: string;
  };
  usuario?: {
    id: number;
    username: string;
    nombre: string;
  };
  usuario_close?: {
    id: number;
    username: string;
    nombre: string;
  };
  cobranza?: CobranzaCapturadaI[]
}

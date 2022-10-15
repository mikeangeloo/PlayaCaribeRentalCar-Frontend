import {CobranzaCapturadaI} from '../../../../../interfaces/cobranza/cobranza-capturada.interface';

export interface ReporteEndpointI {
  id: number;
  created_at: Date;
  fecha_salida: string;
  hora_salida: string;
  fecha_retorno: string;
  hora_retorno: string;
  num_contrato: string;
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
  cobranza_tarjeta_mxn?: number;
  cobranza_tarjeta_usd?: number;
  cobranza_efectivo_mxn: number;
  cobranza_efectivo_usd?: number;
  cobranza_pre_auth_mxn: number;
  cobranza_pre_auth_usd?: number;
  cobranza_deposito_mxn: number;
  cobranza_deposito_usd?: number;
  total_final: number;
  total_cobrado: number;
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

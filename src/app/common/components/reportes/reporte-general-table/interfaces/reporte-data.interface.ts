import {ReporteEndpointI} from './reporte-endpoint.interface';
import {CobranzaCapturada} from '../../../../../interfaces/cobranza/cobranza-capturada.interface';

export interface ReporteDataI {
  fecha_renta: string
  folio: string
  nombre_cliente: string
  suc_salida: string
  agente_entrega: string
  agente_recibe: string
  suc_entrega: string
  vehiculo: string
  placas: string
  km_inicial: number
  km_final: number
  gas_inicial: string
  gas_final: string
  total: number
  total_cobrado: number
  fecha_cierre: string

  estatus: number

  fullData?: ReporteEndpointI

  desgloce_cobranza: CobranzaCapturada[]
}

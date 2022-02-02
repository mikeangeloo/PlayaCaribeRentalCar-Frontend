import {ClientesI} from "../clientes/clientes.interface";
import {VehiculosI} from '../catalogo-vehiculos/vehiculos.interface';
import {TarifasExtrasI} from '../configuracion/tarifas-extras.interface';
import {CobranzaI} from './cobranza-calc.interface';

export interface ContratoI
{
  id: number;
  num_contrato: string;
  vehiculo_id: number;
  tipo_tarifa_id: number;
  tipo_tarifa: string;

  tarifa_modelo_id?: number;
  tarifa_modelo?: string;
  vehiculo_clase_id?: number;
  vehiculo_clase?: string;
  vehiculo_clase_precio?: number;
  comision?: number;

  precio_unitario_inicial: string;
  precio_unitario_final: string;
  fecha_salida: string;
  fecha_retorno: string;
  total_dias: number;
  ub_salida_id: number;
  ub_retorno_id: number;
  cobros_extras_ids?: number[];
  cobros_extras: TarifasExtrasI[];
  subtotal: number
  descuento: number;
  con_iva: number;
  iva: number;
  iva_monto: number;
  total: number;

  folio_cupon?: string;
  valor_cupon?: number;

  cobranza_calc: CobranzaI[];
  hora_elaboracion: string;
  etapas_guardadas: string[];
  etapas_completas?: any;
  estatus: number;
  cliente_id?: number;
  user_create_id: number;
  created_at: Date;
  updated_at: Date;
  cliente?: any;
  vehiculo: VehiculosI;
}

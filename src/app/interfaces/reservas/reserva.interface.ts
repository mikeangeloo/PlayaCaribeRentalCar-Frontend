import {ClientesI} from "../clientes/clientes.interface";
import {VehiculosI} from '../catalogo-vehiculos/vehiculos.interface';
import {TarifasExtrasI} from '../configuracion/tarifas-extras.interface';
import {CobranzaCalcI} from '../cobranza/cobranza-calc.interface';
import {CobranzaProgI} from '../cobranza/cobranza-prog.interface';
import {DragObjProperties} from '../../common/draggable-resizable/draggable-resizable.component';
import { CheckListI } from "../check-list/check-list.interface";
import { CargosExtrasI } from "../configuracion/cargos-extras.interface";

export interface ReservaI
{
  id: number;
  num_contrato: string;
  tipo_tarifa_id: number;
  tipo_tarifa: string;

  modelo_id?: number;
  modelo?: string;
  vehiculo_clase_id?: number;
  vehiculo_clase?: string;
  vehiculo_clase_precio?: number;

  tarifa_modelo?: string;
  tarifa_modelo_id?: number;
  tarifa_apollo_id?: number;
  tarifa_modelo_label?: string;
  tarifa_modelo_precio?: number;
  tarifa_modelo_obj?: string;

  precio_unitario_inicial: string;
  comision?: number;
  precio_unitario_final: string;
  fecha_salida: string;
  fecha_retorno: string;
  total_dias: number;
  ub_salida_id: number;
  ub_retorno_id: number;
  cobros_extras_ids?: number[];
  cobros_extras: TarifasExtrasI[];
  subtotal: number
  con_descuento: number | boolean;
  descuento: number;
  con_iva: number;
  iva: number;
  iva_monto: number;
  total: number;

  folio_cupon?: string;
  valor_cupon?: number;

  cobranza_calc: CobranzaCalcI[];
  hora_elaboracion: string;
  hora_retorno?: string;
  etapas_guardadas: string[];
  etapas_completas?: any;
  estatus: number;
  cliente_id?: number;
  user_create_id: number;
  created_at: Date;
  updated_at: Date;
  cliente?: any;

  cobranza: CobranzaProgI[];

  idioma?: string;

  tipo_vencido?: string
  dias_vencido?: number
  horas_vencido?: number

}


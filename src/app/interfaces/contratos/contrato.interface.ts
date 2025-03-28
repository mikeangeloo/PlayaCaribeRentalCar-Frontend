import {ClientesI} from "../clientes/clientes.interface";
import {VehiculosI} from '../catalogo-vehiculos/vehiculos.interface';
import {TarifasExtrasI} from '../configuracion/tarifas-extras.interface';
import {CobranzaCalcI} from '../cobranza/cobranza-calc.interface';
import {CobranzaProgI} from '../cobranza/cobranza-prog.interface';
import {DragObjProperties} from '../../common/draggable-resizable/draggable-resizable.component';
import { CheckListI } from "../check-list/check-list.interface";
import { CargosExtraI } from "../configuracion/cargos-extras.interface";
import {UsersI} from '../users.interface';

export interface ContratoI
{
  id: number;
  num_contrato: string;
  vehiculo_id: number;
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
  check_form_list_id?: number;
  user_create_id: number;
  created_at: Date;
  updated_at: Date;
  cliente?: any;
  vehiculo: VehiculosI;
  usuario?: UsersI;
  firma_cliente: string;
  firma_matrix: string;

  cobranza: CobranzaProgI[];

  check_list_salida?: DragObjProperties[];
  check_form_list?: CheckListI;
  frecuencia_extra: number;
  cobranzaExtraPor: string;
  // cargo_frecuencia_extra: number;
  // total_frecuencia_extra: number;

  km_final: number;
  km_inicial?: number;
  cant_combustible_retorno:string;
  cant_combustible_salida?: string;
  cargos_retorno_extras_ids?: number[];
  cargos_retorno_extras: CargosExtraI[];
  subtotal_retorno: number;
  con_iva_retorno: number;
  iva_retorno: number;
  iva_monto_retorno: number;
  total_retorno: number;
  cobranza_calc_retorno: CobranzaCalcI[];

  idioma?: string;

  tipo_vencido?: string
  dias_vencido?: number
  horas_vencido?: number
}

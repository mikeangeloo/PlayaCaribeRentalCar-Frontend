import {CategoriasVehiculosI} from "./categorias-vehiculos.interface";
import {MarcasVehiculosI} from "./marcas-vehiculos.interface";
import {VehiculosStatusE} from "../../enums/vehiculos-status.enum";
import {TarifaApolloI} from '../tarifas/tarifa-apollo.interface';
import {ClasesVehiculosI} from './clases-vehiculos.interface';
import {TarifasCategoriasI} from '../configuracion/tarifas-categorias.interface';
import { ContratoI } from "../contratos/contrato.interface";
import { ReservaI } from "../reservas/reserva.interface";
import { PolizasI } from "../polizas/polizas.interface";

export interface VehiculosI
{
  id: number;
  modelo?: string;
  modelo_ano?: string;
  marca_id?: number;
  estatus?: string;
  placas?: string;
  num_poliza_seg?: string;
  km_recorridos?: number;
  prox_km_servicio?: number;
  fecha_prox_servicio?: string;
  categoria_vehiculo_id?: number;
  cant_combustible_anterior?: string;
  cant_combustible?: string;
  color?: string;
  cap_tanque?: string;
  version?: number | string;
  created_at?: Date;
  updated_at?: Date;
  activo?: number;
  marca?: MarcasVehiculosI;
  categoria?: CategoriasVehiculosI;
  codigo?: string;
  num_serie?: string;
  precio_renta?: number;
  tarifas?: TarifaApolloI[];
  tarifa_categoria?: TarifasCategoriasI;
  clase_id?: number;
  clase?: ClasesVehiculosI;
  contrato?: ContratoI | ReservaI
  poliza?: PolizasI
}

export class VehiculosC
{
  static getLabel(status) {
    switch (status) {
      case VehiculosStatusE.DISPONIBLE:
        return 'Disponible';
        break;
      case VehiculosStatusE.RENTADO:
        return 'Rentado';
      case VehiculosStatusE.ENTALLER:
        return 'En taller';
      case VehiculosStatusE.USOPERSONAL:
        return 'Uso personal';
      case VehiculosStatusE.RESERVADO:
        return 'Reservado';
      case VehiculosStatusE.CORRALON:
          return 'Corralon';
      default:
        return '--';
    }
  }
}

import {CategoriasVehiculosI} from "./categorias-vehiculos.interface";
import {MarcasVehiculosI} from "./marcas-vehiculos.interface";
import {VehiculosStatusE} from "../../enums/vehiculos-status.enum";

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
  prox_servicio?: string;
  categoria_vehiculo_id?: number;
  cant_combustible?: string;
  color?: string;
  cap_tanque?: string;
  version?: number;
  created_at?: Date;
  updated_at?: Date;
  activo?: number;
  marca?: MarcasVehiculosI;
  categoria?: CategoriasVehiculosI;
  codigo?: string;
  num_serie?: string;
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
      default:
        return 'No especificado';
    }
  }
}

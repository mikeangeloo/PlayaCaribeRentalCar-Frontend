import {CategoriasVehiculosI} from "./categorias-vehiculos.interface";
import {MarcasVehiculosI} from "./marcas-vehiculos.interface";

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
}

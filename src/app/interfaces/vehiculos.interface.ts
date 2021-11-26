import {ModelosI} from "./modelos.interface";
import {MarcasI} from "./marcas.interface";
import {ColoresI} from "./colores.interface";

export interface VehiculosI
{
  id: number;
  marca_id?: number;
  modelo_id?: number;
  color_id?: number;
  no_placas?: string;
  cap_tanque?: any;
  kilometraje_salida?: any;
  kilometraje_llegada?: any;
  gas_salida?: any;
  gas_llegada?: any;
  activo?: number;
  created_at?: Date;
  updated_at?: Date;
  nombre?: any;
  version?: any;
  precio_venta?: any;
  modelo?: ModelosI;
  marca?: MarcasI;
  color?: ColoresI;
}

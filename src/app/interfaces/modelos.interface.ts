import {MarcasI} from "./marcas.interface";

export interface ModelosI
{
  id?: number;
  modelo?: string;
  marca_id?: number;
  activo?: number;
  created_at?: Date;
  updated_at?: Date;
  marca?: MarcasI;
}

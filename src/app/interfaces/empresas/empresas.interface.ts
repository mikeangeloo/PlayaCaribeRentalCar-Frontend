import {ComisionistasI} from "../comisionistas/comisionistas.interface";

export interface EmpresasI
{
  id: number;
  nombre?: string;
  rfc?: string;
  direccion?: string;
  tel_contacto?: string;
  activo?: number;
  created_at?: string;
  updated_at?: string;
  paga_cupon?: boolean;
  comisionistas?: ComisionistasI[]
}

import {TarifaHotelesI} from '../tarifas/tarifa-hoteles.interface';


export interface HotelesI
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

  tarifas?: TarifaHotelesI[];
}

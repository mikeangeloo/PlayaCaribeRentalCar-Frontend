import {TarifaApolloConfI} from '../tarifas/tarifa-apollo-conf.interface';

export interface TarifasCategoriasI
{
  id?: number;
  categoria?: string;
  precio_renta?: string;
  activo?: number;
  created_at?: Date;
  updated_at?: Date;
  tarifas?: TarifaApolloConfI[]
}

import {TarifaApolloConfI} from './tarifa-apollo-conf.interface';

export interface TarifaHotelesI
{
    id?: number;
    hotel_id?: number;
    clase_id?: number
    clase?: string;
    precio_renta?: number;
    activo?: boolean;
    created_at?: string;
    updated_at?: string;

    errors?: string[];
    tarifas_apollo?: TarifaApolloConfI[];

    view_frequency?: boolean;
}

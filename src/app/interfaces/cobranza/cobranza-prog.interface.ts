import {CardI} from '../cards/card.interface';

export interface CobranzaProgI
{
    id?: number;
    contrato_id?: number;
    tarjeta_id?: number;
    fecha_cargo?: string;
    monto?: string;
    moneda?: string;
    tipo?: number;
    estatus?: number;
    fecha_procesado?: string;
    cod_banco?: string;
    res_banco?: string;
    fecha_reg?: string;
    created_at?: string;
    updated_at?: string;
    tarjeta?: CardI;

    edit?: boolean;
}

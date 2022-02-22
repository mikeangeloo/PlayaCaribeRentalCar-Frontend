export interface TarifaApolloConfI
{
    id?: number;
    modelo?: string;
    frecuencia?: string;
    frecuencia_ref?: string;
    ap_descuento?: number | boolean;
    valor_descuento?: number;
    activo?: boolean;
    precio_final_editable?: number;
    required?: boolean;
    created_at?: Date;
    updated_at?: Date;

    errors?: string[];
}

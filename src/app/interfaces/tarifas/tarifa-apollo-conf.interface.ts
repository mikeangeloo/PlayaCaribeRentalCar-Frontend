export interface TarifaApolloConfI
{
    id?: number;
    modelo?: string;
    frecuencia?: string;
    frecuencia_ref?: string;
    precio_base?: number;
    ap_descuento?: number | boolean;
    valor_descuento?: number;
    activo?: boolean;
    precio_final_editable?: number;
    precio_final?: number;
    required?: boolean;
    created_at?: string;
    updated_at?: string;

    enable?: boolean;

    errors?: string[];
}

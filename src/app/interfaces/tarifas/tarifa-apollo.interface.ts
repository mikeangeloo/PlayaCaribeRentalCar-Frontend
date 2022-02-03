export interface TarifaApolloI
{
    id?: number;
    modelo?: string;
    modelo_id?: number;
    frecuencia?: string;
    frecuencia_ref?: string;
    precio_base?: number;
    ap_descuento?: boolean | number;
    descuento?: number;
    valor_descuento?: number;
    precio_final?: number;
    precio_final_editable?: boolean | number,
    activo?: boolean;
    created_at?: string;
    updated_at?: string;

    required?: boolean;
    errors?: string[];
}

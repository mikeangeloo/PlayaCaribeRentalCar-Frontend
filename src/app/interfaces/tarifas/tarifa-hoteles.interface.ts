export interface TarifaHotelesI
{
    id?: number;
    hotel_id?: number;
    clase_id?: number
    clase?: string;
    precio?: number;
    activo?: boolean;
    created_at?: string;
    updated_at?: string;

    errors?: string[];
}

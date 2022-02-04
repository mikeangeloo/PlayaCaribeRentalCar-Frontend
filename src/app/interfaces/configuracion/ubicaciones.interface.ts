export interface UbicacionesI
{
    id?: number;
    pais?: string;
    estado?: string;
    municipio?: string;
    colonia?: string;
    direccion?: string;
    cp?: string;
    referencias?: any;
    activo?: number;
    created_at?: Date;
    updated_at?: Date;
}

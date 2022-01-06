export interface ContratoI
{
  id: number;
  renta_of_id?: number;
  renta_of_codigo?: string;
  renta_of_dir?: string;
  renta_of_fecha?: string;
  renta_of_hora?: string;
  retorno_of_id?: number;
  retorno_of_codigo?: string;
  retorno_of_dir?: string;
  retorno_of_fecha?: string;
  retorno_of_hora?: string;
  num_contrato?: string;
  vehiculo_id?: any;
  user_create_id?: number;
  created_at?: Date;
  updated_at?: Date;
  etapas_guardadas?: string[];
  etapas_completas?: any;
  estatus?: number;
}

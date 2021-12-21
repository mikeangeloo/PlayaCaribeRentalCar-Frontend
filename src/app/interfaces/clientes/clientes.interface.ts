export interface ClientesI
{
  id: number;
  nombre?: string;
  apellidos?: string;
  telefono?: string;
  num_licencia?: string;
  licencia_mes?: string;
  licencia_ano?: string;
  activo?: number;
  created_at?: Date;
  updated_at?: Date;
  email?: string;
  tarjetas?: any[];
}

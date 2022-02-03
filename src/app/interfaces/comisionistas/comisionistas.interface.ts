export interface ComisionistasI
{
  id: number;
  nombre?: string;
  apellidos?: string;
  tel_contacto?: string;
  email_contacto?: string;
  comisiones_pactadas?: number[];
  activo?: number;
  created_at?: Date;
  updated_at?: Date;
}

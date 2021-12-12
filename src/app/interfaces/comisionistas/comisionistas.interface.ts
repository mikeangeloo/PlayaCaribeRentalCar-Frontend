import {EmpresasI} from "../empresas/empresas.interface";

export interface ComisionistasI
{
  id: number;
  nombre?: string;
  apellidos?: string;
  nombre_empresa?: string;
  empresa_id?: number;
  tel_contacto?: string;
  email_contacto?: string;
  comisiones_pactadas?: number[];
  activo?: number;
  created_at?: Date;
  updated_at?: Date;
  empresa?: EmpresasI;
}

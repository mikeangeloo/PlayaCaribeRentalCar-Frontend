import {AreaTrabajoI} from "./profile/area-trabajo.interface";
import {RoleI} from "./profile/role.interface";
import {SucursalesI} from "./sucursales.interface";

export interface UsersI
{
  id: number;
  area_trabajo_id?: number;
  role_id?: number;
  nombre?: string;
  apellidos?: string;
  email?: string;
  telefono?: string;
  username?: string;
  created_at?: Date;
  updated_at?: Date;
  sucursal_id?: number;
  activo?: number;
  area_trabajo?: AreaTrabajoI;
  rol?: RoleI;
  sucursal?: SucursalesI;
}

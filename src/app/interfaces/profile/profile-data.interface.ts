import {RoleI} from "./role.interface";
import {AreaTrabajoI} from "./area-trabajo.interface";
import {SucursalesI} from "../sucursales.interface";

export interface ProfileDataI
{
  id?: number;
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  activo: number;
  rol: RoleI;
  area_trabajo: AreaTrabajoI;
  sucursal?: SucursalesI;
}

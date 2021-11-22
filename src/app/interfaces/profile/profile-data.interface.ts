import {RoleI} from "./role.interface";
import {AreaTrabajoI} from "./area-trabajo.interface";

export interface ProfileDataI
{
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  activo: number;
  rol: RoleI;
  area_trabajo: AreaTrabajoI;
}

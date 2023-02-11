import { Pipe, PipeTransform } from '@angular/core';
import {RoleLevelsTypes} from '../enums/role-levels.enum';

@Pipe({
  name: 'roleName'
})
export class RoleNamePipe implements PipeTransform {

  transform(roleScope: RoleLevelsTypes): string {
    switch (roleScope) {
      case 20:
        return 'Administrador';
      case 15:
        return 'Gerente';
      case 5:
        return 'Vendedor';
      default:
        return 'Sin Rol'
    }
  }

}

import { RoleLevelsTypes } from '../enums/role-levels.enum';
import { RoleNamePipe } from './role-name.pipe';

describe('RoleNamePipe', () => {
  const pipe = new RoleNamePipe();
  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should get Administrator role', () => {
    const role = pipe.transform(20)
    expect(role).toEqual('Administrador')
  })

  it('should get Manager role', () => {
    const role = pipe.transform(15)
    expect(role).toEqual('Gerente')
  })

  it('should get Sales role', () => {
    const role = pipe.transform(5)
    expect(role).toEqual('Vendedor')
  })

  it('should get default role', () => {
    const role = pipe.transform(50 as RoleLevelsTypes)
    expect(role).toEqual('Sin Rol')
  })
});

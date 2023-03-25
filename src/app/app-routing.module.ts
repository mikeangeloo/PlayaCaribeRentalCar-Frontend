import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {AuthGuard} from './guards/auth.guard';
import {RolesScopeGuard} from './guards/roles-scope.guard';
import {RoleLevelsEnum} from './enums/role-levels.enum';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./modules/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'otp',
    loadChildren: () => import('./modules/recovery-account/recovery-account.module').then( m => m.RecoveryAccountPageModule)
  },
  {
    path: '',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'welcome',
        loadChildren: () => import('./welcome/welcome.module').then(m => m.WelcomePageModule)
      },
      {
        path: 'dashboard',
        canActivate: [RolesScopeGuard],
        data: {allowedLevels: [RoleLevelsEnum.ADMINISTRATOR]},
        loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
      },
      {
        path: 'contratos',
        canActivate: [RolesScopeGuard],
        data: {allowedLevels: [RoleLevelsEnum.ADMINISTRATOR, RoleLevelsEnum.MANAGAER, RoleLevelsEnum.SALESAGENT]},
        loadChildren: () => import('./modules/contratos/contrato/contrato.module').then( m => m.ContratoPageModule)
      },
      {
        path: 'vehiculos/list',
        canActivate: [RolesScopeGuard],
        data: {allowedLevels: [RoleLevelsEnum.ADMINISTRATOR, RoleLevelsEnum.MANAGAER, RoleLevelsEnum.SALESAGENT]},
        loadChildren: () => import('./modules/vehiculos/listado-vehiculos/listado-vehiculos.module').then(m=> m.ListadoVehiculosPageModule)
      },
      // region REPORTES
      {
        path: 'reportes',
        canActivate: [RolesScopeGuard],
        data: {allowedLevels: [RoleLevelsEnum.ADMINISTRATOR, RoleLevelsEnum.MANAGAER]},
        loadChildren: () => import('./modules/reportes/reportes.module').then(m => m.ReportesModule)
      },
      // endregion

      //region ADMINISTRACION
      {
        path: 'administracion',
        canActivate: [RolesScopeGuard],
        data: {allowedLevels: [RoleLevelsEnum.ADMINISTRATOR, RoleLevelsEnum.MANAGAER]},
        children: [
          //region CATALOGO VEHICULOS
          {
            path: 'catalogo-vehiculos/listado-vehiculos',
            loadChildren: () => import('./modules/catalogo-vehiculos/vehiculos/vehiculos.module').then(m => m.VehiculosPageModule)
          },
          {
            path: 'catalogo-vehiculos/categorias-vehiculos',
            loadChildren: () => import('./modules/catalogo-vehiculos/categorias-vehiculos/categorias-vehiculos.module').then(m => m.CategoriasVehiculosPageModule)
          },
          {
            path: 'catalogo-vehiculos/marcas-vehiculos',
            loadChildren: () => import('./modules/catalogo-vehiculos/marcas-vehiculos/marcas-vehiculos.module').then(m => m.MarcasVehiculosPageModule)
          },
          {
            path: 'catalogo-vehiculos/clases-vehiculos',
            loadChildren: () => import('./modules/catalogo-vehiculos/clases-vehiculos/clases-vehiculos.module').then(m => m.ClasesVehiculosPageModule)
          },
          {
            path: 'catalogo-vehiculos/polizas',
            loadChildren: () => import('./modules/polizas/polizas.module').then( m => m.PolizasPageModule)
          },
          //endregion

          //region CONTROL ACCESSO
          {
            path: 'control-acceso/listado-usuarios',
            loadChildren: () => import('./modules/control-acceso/users/users.module').then(m => m.UsersPageModule)
          },
          {
            path: 'control-acceso/listado-sucursales',
            loadChildren: () => import('./modules/control-acceso/sucursales/sucursales.module').then(m => m.SucursalesPageModule)
          },
          {
            path: 'control-acceso/listado-roles',
            loadChildren: () => import('./modules/control-acceso/roles/roles.module').then(m => m.RolesPageModule)
          },
          {
            path: 'control-acceso/listado-areas-trabajo',
            loadChildren: () => import('./modules/control-acceso/areas-trabajo/areas-trabajo.module').then(m => m.AreasTrabajoPageModule)
          },
          //endregion

          //region HOTELES
          {
            path: 'externos/listado-externos',
            loadChildren: () => import('./modules/hoteles/listado-hoteles/listado-hoteles.module').then(m => m.ListadoHotelesPageModule)
          },
          //endregion

          //#region COMISIONISTAS
          {
            path: 'comisionistas/listado-comisionistas',
            loadChildren: () => import('./modules/comisionistas/comisionistas.module').then(m => m.ComisionistasPageModule)
          },
          //#endregion

          //region CLIENTES
          {
            path: 'clientes/listado-clientes',
            loadChildren: () => import('./modules/clientes/listado-clientes/listado-clientes.module').then( m => m.ListadoClientesPageModule)
          },
          //endregion

          //region CONFIGURACION
          {
            path: 'catalogos',
            loadChildren: () => import('./modules/configuracion/configuracion.module').then( m => m.ConfiguracionModule)
          },
          //endregion
        ]
      }
      //endregion

    ]
  },
  {
    path: 'welcome',
    loadChildren: () => import('./welcome/welcome.module').then( m => m.WelcomePageModule)
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

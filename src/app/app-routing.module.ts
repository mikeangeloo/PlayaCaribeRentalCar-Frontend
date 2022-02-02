import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {AuthGuard} from "./guards/auth.guard";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
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
        path: 'dashboard',
        loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
      },
      {
        path: 'contratos/nuevo',
        loadChildren: () => import('./modules/contratos/contrato/contrato.module').then( m => m.ContratoPageModule)
      },
      //region ADMINISTRACION

          //region CATALOGO VEHICULOS
          {
            path: 'administracion/catalogo-vehiculos/listado-vehiculos',
            loadChildren: () => import('./modules/catalogo-vehiculos/vehiculos/vehiculos.module').then(m => m.VehiculosPageModule)
          },
          {
            path: 'administracion/catalogo-vehiculos/categorias-vehiculos',
            loadChildren: () => import('./modules/catalogo-vehiculos/categorias-vehiculos/categorias-vehiculos.module').then(m => m.CategoriasVehiculosPageModule)
          },
          {
            path: 'administracion/catalogo-vehiculos/marcas-vehiculos',
            loadChildren: () => import('./modules/catalogo-vehiculos/marcas-vehiculos/marcas-vehiculos.module').then(m => m.MarcasVehiculosPageModule)
          },
          {
            path: 'administracion/catalogo-vehiculos/clases-vehiculos',
            loadChildren: () => import('./modules/catalogo-vehiculos/clases-vehiculos/clases-vehiculos.module').then(m => m.ClasesVehiculosPageModule)
          },
          //endregion

          //region CONTROL ACCESSO
          {
            path: 'administracion/control-acceso/listado-usuarios',
            loadChildren: () => import('./modules/control-acceso/users/users.module').then(m => m.UsersPageModule)
          },
          {
            path: 'administracion/control-acceso/listado-sucursales',
            loadChildren: () => import('./modules/control-acceso/sucursales/sucursales.module').then(m => m.SucursalesPageModule)
          },
          {
            path: 'administracion/control-acceso/listado-roles',
            loadChildren: () => import('./modules/control-acceso/roles/roles.module').then(m => m.RolesPageModule)
          },
          {
            path: 'administracion/control-acceso/listado-areas-trabajo',
            loadChildren: () => import('./modules/control-acceso/areas-trabajo/areas-trabajo.module').then(m => m.AreasTrabajoPageModule)
          },
          //endregion

          //region HOTELES
          {
            path: 'administracion/hoteles/listado-hoteles',
            loadChildren: () => import('./modules/hoteles/listado-hoteles/listado-hoteles.module').then(m => m.ListadoHotelesPageModule)
          },
          {
            path: 'administracion/hoteles/listado-comisionistas',
            loadChildren: () => import('./modules/hoteles/comisionistas/comisionistas.module').then(m => m.ComisionistasPageModule)
          },
          //endregion

          //region CLIENTES
          {
            path: 'administracion/clientes/listado-clientes',
            loadChildren: () => import('./modules/clientes/listado-clientes/listado-clientes.module').then( m => m.ListadoClientesPageModule)
          },
          //endregion

          //region CONFIGURACION
        {
            path: 'administracion/configuracion',
            loadChildren: () => import('./modules/configuracion/configuracion.module').then( m => m.ConfiguracionModule)
        },
        //endregion
      //endregion

    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

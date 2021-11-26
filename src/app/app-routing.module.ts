import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {AuthGuard} from "./guards/auth.guard";

const routes: Routes = [
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
        path: 'catalogos/empresas',
        loadChildren: () => import('./modules/catalogs/empresas/empresas.module').then( m => m.EmpresasPageModule)
      },
      {
        path: 'catalogos/sucursales',
        loadChildren: () => import('./modules/catalogs/sucursales/sucursales.module').then( m => m.SucursalesPageModule)
      },
      {
        path: 'catalogos/marcas',
        loadChildren: () => import('./modules/catalogs/marcas/marcas.module').then( m => m.MarcasPageModule)
      },
      {
        path: 'catalogos/modelos',
        loadChildren: () => import('./modules/catalogs/modelos/modelos.module').then(m => m.ModelosPageModule)
      },
      {
        path: 'catalogos/colores',
        loadChildren: () => import('./modules/catalogs/colores/colores.module').then(m => m.ColoresPageModule)
      },
      {
        path: 'usuarios',
        loadChildren: () => import('./modules/users/users.module').then( m => m.UsersPageModule)
      },
      {
        path: 'usuarios/areas-trabajo',
        loadChildren: () => import('./modules/areas-trabajo/areas-trabajo.module').then( m => m.AreasTrabajoPageModule)
      },
      {
        path: 'usuarios/roles',
        loadChildren: () => import('./modules/roles/roles.module').then( m => m.RolesPageModule)
      },
      {
        path: 'vehiculos/disponibles',
        loadChildren: () => import('./modules/vehiculos/vehiculos.module').then( m => m.VehiculosPageModule)
      },
    ]
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

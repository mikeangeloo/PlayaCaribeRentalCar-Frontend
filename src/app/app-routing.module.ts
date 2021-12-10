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
        path: 'administracion/acceso/sucursales',
        loadChildren: () => import('./modules/catalogs/sucursales/sucursales.module').then( m => m.SucursalesPageModule)
      },
      {
        path: 'administracion/cat-vehiculos/marcas-vehiculos-vehiculos',
        loadChildren: () => import('./modules/catalogo-vehiculos/marcas-vehiculos/marcas-vehiculos.module').then(m => m.MarcasVehiculosPageModule)
      },
      {
        path: 'catalogos/categorias-vehiculos',
        loadChildren: () => import('./modules/catalogo-vehiculos/categorias-vehiculos/categorias-vehiculos.module').then(m => m.CategoriasVehiculosPageModule)
      },
      {
        path: 'administracion/acceso/usuarios',
        loadChildren: () => import('./modules/users/users.module').then( m => m.UsersPageModule)
      },
      {
        path: 'administracion/acceso/areas-trabajo',
        loadChildren: () => import('./modules/areas-trabajo/areas-trabajo.module').then( m => m.AreasTrabajoPageModule)
      },
      {
        path: 'administracion/acceso/roles',
        loadChildren: () => import('./modules/roles/roles.module').then( m => m.RolesPageModule)
      },
      {
        path: 'administracion/cat-vehiculos/disponibles',
        loadChildren: () => import('./modules/catalogo-vehiculos/vehiculos/vehiculos.module').then(m => m.VehiculosPageModule)
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

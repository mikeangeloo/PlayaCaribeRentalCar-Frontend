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
    ]
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

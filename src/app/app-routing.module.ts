import { NgModule } from '@angular/core';
import { authGuard } from './auth/auth.guard';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home/:email/:hash',
    canActivate: [authGuard],
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },

  // {
  //   path: 'tabs',
  //   loadChildren: () => import('./tabs/tabs.module').then( m => m.TabsPageModule)
  // },
  // {
  //   path: 'test',
  //   loadChildren: () => import('./test/test.module').then( m => m.TestPageModule)
  // },
  // {
  //   path: 'authentication',
  //   loadChildren: () => import('./auth/authentication/authentication.module').then(m => m.AuthenticationPageModule)
  // },
  // {
  //   path: 'splash',
  //   loadChildren: () => import('./splash/splash.module').then(m => m.SplashPageModule)
  // },
  // {
  //   path: ':stateId',
  //   loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  // },
  // {
  //   path: ':stateId',
  //   loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  // },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

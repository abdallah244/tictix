// app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/loading', pathMatch: 'full' },
  { path: 'loading', loadComponent: () => import('./components/loading/loading').then(m => m.LoadingComponent) },
  { path: 'home', loadComponent: () => import('./components/home/home').then(m => m.Home) },
  { path: 'game', loadComponent: () => import('./components/game/game').then(m => m.Game) },
  
  { path: '**', redirectTo: '/loading' }
];

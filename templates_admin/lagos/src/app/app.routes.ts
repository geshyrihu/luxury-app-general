import { Routes } from '@angular/router';

import { AdminGuard } from './shared/guard/admin.guard';
import { fullRoutes } from './shared/routes/full-routes';
import { content } from './shared/routes/routes';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard/default',
    pathMatch: 'full',
  },
  {
    path: 'auth/login',
    loadComponent: () => import('./auth/login/login').then(m => m.Login),
  },
  {
    path: '',
    loadComponent: () => import('./shared/components/layout/content/content').then(m => m.Content),
    children: content,
    canActivate: [AdminGuard],
  },
  {
    path: '',
    loadComponent: () => import('./shared/components/layout/full/full').then(m => m.Full),
    children: fullRoutes,
    canActivate: [AdminGuard],
  },
  {
    path: '**',
    redirectTo: 'error-page/error-400',
    pathMatch: 'full',
  },
];

import { Routes } from '@angular/router';

export const ErrorPages: Routes = [
  {
    path: '',
    children: [
      {
        path: 'error-400',
        loadComponent: () => import('./error400/error400').then(m => m.Error400),
      },
      {
        path: 'error-401',
        loadComponent: () => import('./error401/error401').then(m => m.Error401),
      },
      {
        path: 'error-403',
        loadComponent: () => import('./error403/error403').then(m => m.Error403),
      },
      {
        path: 'error-404',
        loadComponent: () => import('./error404/error404').then(m => m.Error404),
      },
      {
        path: 'error-500',
        loadComponent: () => import('./error500/error500').then(m => m.Error500),
      },
      {
        path: 'error-503',
        loadComponent: () => import('./error503/error503').then(m => m.Error503),
      },
    ],
  },
];

import { Routes } from '@angular/router';

export const SoicalApp: Routes = [
  {
    path: '',
    loadComponent: () => import('./social-app').then(m => m.SocialApp),
    data: {
      title: 'Soical App',
      breadcrumb: 'Soical App',
    },
  },
];

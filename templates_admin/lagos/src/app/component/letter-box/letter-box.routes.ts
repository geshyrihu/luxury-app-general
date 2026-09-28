import { Routes } from '@angular/router';

export const Emails: Routes = [
  {
    path: '',
    loadComponent: () => import('./email').then(m => m.Email),
    data: {
      title: 'Letter Box',
      breadcrumb: 'Letter Box',
    },
  },
];

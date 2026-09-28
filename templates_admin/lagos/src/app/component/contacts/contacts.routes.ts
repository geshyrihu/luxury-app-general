import { Routes } from '@angular/router';

export const Contact: Routes = [
  {
    path: '',
    loadComponent: () => import('./contacts').then(m => m.Contacts),
    data: {
      title: 'Contacts',
      breadcrumb: 'Contacts',
    },
  },
];

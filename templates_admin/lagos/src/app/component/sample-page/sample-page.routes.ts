import { Routes } from '@angular/router';

export const SamplePages: Routes = [
  {
    path: '',
    loadComponent: () => import('./sample-page').then(m => m.SamplePage),
    data: {
      title: 'Sample Page',
      breadcrumb: 'Sample Page',
    },
  },
];

import { Routes } from '@angular/router';

export const calendar: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () => import('./calendar').then(m => m.Calendar),
        data: {
          title: 'Calender Basic',
          breadcrumb: 'Calender Basic',
        },
      },
    ],
  },
];

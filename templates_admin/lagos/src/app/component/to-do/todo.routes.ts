import { Routes } from '@angular/router';

export const Todo: Routes = [
  {
    path: '',
    loadComponent: () => import('./to-do').then(m => m.ToDo),
    data: {
      title: 'To Do',
      breadcrumb: 'To Do',
    },
  },
];

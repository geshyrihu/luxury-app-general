import { Routes } from '@angular/router';

export const Project: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list',
        loadComponent: () => import('./project-list/project-list').then(m => m.ProjectList),
        data: {
          title: 'Project List',
          breadcrumb: 'Project List',
        },
      },
      {
        path: 'create',
        loadComponent: () => import('./create-new/create-new').then(m => m.CreateNew),
        data: {
          title: 'Project Create',
          breadcrumb: 'Project Create',
        },
      },
    ],
  },
];

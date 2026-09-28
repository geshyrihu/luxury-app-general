import { Routes } from '@angular/router';

export const Editor: Routes = [
  {
    path: '',
    children: [
      {
        path: 'ngx-editor',
        loadComponent: () => import('./ngx-editor/ngx-editor').then(m => m.NgxEditor),
        data: {
          title: 'Ngx Editor',
          breadcrumb: 'Ngx Editor',
        },
      },
      {
        path: 'mde-editor',
        loadComponent: () => import('./mde-editors/mde-editors').then(m => m.MdeEditors),
        data: {
          title: 'MDE Editor',
          breadcrumb: 'MDE Editor',
        },
      },
    ],
  },
];

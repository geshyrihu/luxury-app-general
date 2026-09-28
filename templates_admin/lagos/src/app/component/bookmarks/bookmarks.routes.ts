import { Routes } from '@angular/router';

export const Bookmarks: Routes = [
  {
    path: '',
    loadComponent: () => import('./bookmark').then(m => m.Bookmark),
    data: {
      title: 'Bookmarks',
      breadcrumb: 'Bookmarks',
    },
  },
];

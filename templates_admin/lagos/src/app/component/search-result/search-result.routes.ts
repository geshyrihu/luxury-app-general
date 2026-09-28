import { Routes } from '@angular/router';

export const Search: Routes = [
  {
    path: '',
    loadComponent: () => import('./search-result').then(m => m.SearchResult),
    data: {
      title: 'Search Website',
      breadcrumb: 'Search Website',
    },
  },
];

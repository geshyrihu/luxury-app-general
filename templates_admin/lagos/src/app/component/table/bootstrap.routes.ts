import { Routes } from '@angular/router';

export const bootstrapTables: Routes = [
  {
    path: '',
    children: [
      {
        path: 'basic-table',
        loadComponent: () => import('./basic-table/basic-table').then(m => m.BasicTable),
        data: {
          title: 'Bootstrap Basic Tables',
          breadcrumb: 'Bootstrap Basic Tables',
        },
      },
      {
        path: 'table-components',
        loadComponent: () =>
          import('./table-components/table-components').then(m => m.TableComponents),
        data: {
          title: 'Table Components',
          breadcrumb: 'Table Components',
        },
      },
      {
        path: 'datatable',
        loadComponent: () => import('./data-tables/data-tables').then(m => m.DataTables),
        data: [
          {
            title: 'Data Table',
            breadcrumb: 'Data Table',
          },
        ],
      },
    ],
  },
];

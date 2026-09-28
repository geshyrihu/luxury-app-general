import { Routes } from '@angular/router';

import { DataTables } from './data-tables';

export const DataTable: Routes = [
  {
    path: 'datatables',
    component: DataTables,
    data: [
      {
        title: 'Data Table',
        breadcrumb: 'Data Table',
      },
    ],
  },
];

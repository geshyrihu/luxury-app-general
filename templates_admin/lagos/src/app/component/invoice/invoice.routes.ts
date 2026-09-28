import { Routes } from '@angular/router';

export const Invoice: Routes = [
  {
    path: '',
    children: [
      {
        path: 'invoice-1',
        loadComponent: () => import('./invoice-one/invoice-one').then(m => m.InvoiceOne),
        data: {
          title: 'Invoice-1',
          breadcrumb: 'Invoice-1',
        },
      },
      {
        path: 'invoice-2',
        loadComponent: () => import('./invoice-two/invoice-two').then(m => m.InvoiceTwo),
        data: {
          title: 'Invoice-2',
          breadcrumb: 'Invoice-2',
        },
      },
      {
        path: 'invoice-3',
        loadComponent: () => import('./invoice-three/invoice-three').then(m => m.InvoiceThree),
        data: {
          title: 'Invoice-3',
          breadcrumb: 'Invoice-3',
        },
      },
      {
        path: 'invoice-4',
        loadComponent: () => import('./invoice-four/invoice-four').then(m => m.InvoiceFour),
        data: {
          title: 'Invoice-4',
          breadcrumb: 'Invoice-4',
        },
      },
      {
        path: 'invoice-5',
        loadComponent: () => import('./invoice-five/invoice-five').then(m => m.InvoiceFive),
        data: {
          title: 'Invoice-5',
          breadcrumb: 'Invoice-5',
        },
      },
      {
        path: '',
        loadComponent: () => import('./invoice-six/invoice-six').then(m => m.InvoiceSix),
        data: {
          title: 'Invoice-6',
          breadcrumb: 'Invoice-6',
        },
      },
    ],
  },
];

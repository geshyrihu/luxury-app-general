import { Routes } from '@angular/router';

export const Buttons: Routes = [
  {
    path: '',
    children: [
      {
        path: 'default-style',
        loadComponent: () => import('./default/default').then(m => m.Default),
        data: {
          title: 'Default Style',
          breadcrumb: 'Default Style',
        },
      },
      {
        path: 'flat-style',
        loadComponent: () => import('./flat-buttons/flat-buttons').then(m => m.FlatButtons),
        data: {
          title: 'Flat Buttons',
          breadcrumb: 'Flat Buttons',
        },
      },
      {
        path: 'edge-style',
        loadComponent: () => import('./buttons-edge/buttons-edge').then(m => m.ButtonsEdge),
        data: {
          title: 'Edge Buttons',
          breadcrumb: 'Edge Buttons',
        },
      },
      {
        path: 'raised-style',
        loadComponent: () => import('./raised-buttons/raised-buttons').then(m => m.RaisedButtons),
        data: {
          title: 'Raised Buttons',
          breadcrumb: 'Raised Buttons',
        },
      },
      {
        path: 'button-group',
        loadComponent: () => import('./button-group/button-group').then(m => m.ButtonGroup),
        data: {
          title: 'Button Group',
          breadcrumb: 'Button Group',
        },
      },
    ],
  },
];

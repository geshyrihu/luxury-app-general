import { Routes } from '@angular/router';

export const Charts: Routes = [
  {
    path: '',
    children: [
      {
        path: 'apex-chart',
        loadComponent: () => import('./apex-charts/apex-charts').then(m => m.ApexCharts),
        data: {
          title: 'Apex Chart',
          breadcrumb: 'Apex Chart',
        },
      },
      {
        path: 'google-chart',
        loadComponent: () => import('./google-chart/google-chart').then(m => m.GoogleChart),
        data: {
          title: 'Google Chart',
          breadcrumb: 'Google Chart',
        },
      },
      {
        path: 'chartjs-chart',
        loadComponent: () => import('./chart-js-chart/chart-js-chart').then(m => m.ChartJSChart),
        data: {
          title: 'ChartJS Chart',
          breadcrumb: 'ChartJS Chart',
        },
      },
      {
        path: 'chartist-chart',
        loadComponent: () => import('./chart-lis-chart/chart-lis-chart').then(m => m.ChartLisChart),
        data: {
          title: 'Chartist Chart',
          breadcrumb: 'Chartist Chart',
        },
      },
    ],
  },
];

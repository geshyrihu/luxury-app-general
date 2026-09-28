import { Routes } from '@angular/router';

export const hidenav: Routes = [
  {
    path: '',
    children: [
      {
        path: 'hide-nav-scroll',
        loadComponent: () => import('./hide-scrool-nav/hide-scrool-nav').then(m => m.HideScroolNav),
        data: {
          title: 'Hide Menu On Scrolll',
          breadcrumb: 'Hide Menu On Scrolll',
        },
      },
      {
        path: 'footer-dark',
        loadComponent: () => import('./footer-dark/footer-dark').then(m => m.FooterDark),
        data: {
          title: 'Footer Dark',
          breadcrumb: 'Footer Dark',
        },
      },
      {
        path: 'footer-light',
        loadComponent: () => import('./footer-light/footer-light').then(m => m.FooterLight),
        data: {
          title: 'Footer Light',
          breadcrumb: 'Footer Light',
        },
      },
      {
        path: 'footer-fixed',
        loadComponent: () => import('./footer-fixed/footer-fixed').then(m => m.FooterFixed),
        data: {
          title: 'Footer Fixed',
          breadcrumb: 'Footer Fixed',
        },
      },
    ],
  },
];

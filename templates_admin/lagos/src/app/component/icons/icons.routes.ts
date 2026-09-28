import { Routes } from '@angular/router';

export const Icons: Routes = [
  {
    path: '',
    children: [
      {
        path: 'flag-icon',
        loadComponent: () => import('./flag-icons/flag-icons').then(m => m.FlagIcons),
        data: {
          title: 'Flag Icons',
          breadcrumb: 'Flag Icons',
        },
      },
      {
        path: 'fontawesome',
        loadComponent: () => import('./font-awesome/font-awesome').then(m => m.FontAwesome),
        data: {
          title: 'Font Awesome Icon',
          breadcrumb: 'Font Awesome Icon',
        },
      },
      {
        path: 'ico-icons',
        loadComponent: () => import('./ico-icon/ico-icon').then(m => m.IcoIcon),
        data: {
          title: 'ICO Icon',
          breadcrumb: 'ICO Icon',
        },
      },
      {
        path: 'themify-icons',
        loadComponent: () => import('./themify-icon/themify-icon').then(m => m.ThemifyIcon),
        data: {
          title: 'Themify icon',
          breadcrumb: 'Themify icon',
        },
      },
      {
        path: 'feather-icons',
        loadComponent: () => import('./feather-icon/feather-icon').then(m => m.FeatherIcon),
        data: {
          title: 'Feather Icons',
          breadcrumb: 'Feather Icons',
        },
      },
      {
        path: 'weather-icons',
        loadComponent: () => import('./whether-icon/whether-icon').then(m => m.WhetherIcon),
        data: {
          title: 'Whether Icon',
          breadcrumb: 'Whether Icon',
        },
      },
    ],
  },
];

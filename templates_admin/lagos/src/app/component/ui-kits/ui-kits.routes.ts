import { Routes } from '@angular/router';

export const UiKits: Routes = [
  {
    path: '',
    children: [
      {
        path: 'typography',
        loadComponent: () => import('./typography/typography').then(m => m.Typography),
        data: {
          title: 'Typography',
          breadcrumb: 'Typography',
        },
      },
      {
        path: 'avatars',
        loadComponent: () => import('./avatars/avatars').then(m => m.Avatars),
        data: {
          title: 'Avatars',
          breadcrumb: 'Avatars',
        },
      },
      {
        path: 'helper-classes',
        loadComponent: () => import('./helper-classes/helper-classes').then(m => m.HelperClasses),
        data: {
          title: 'Helper Classes',
          breadcrumb: 'Helper Classes',
        },
      },
      {
        path: 'grid',
        loadComponent: () => import('./grid/grid').then(m => m.Grid),
        data: {
          title: 'Grid',
          breadcrumb: 'Grid',
        },
      },
      {
        path: 'tag-pills',
        loadComponent: () => import('./tag-pills/tag-pills').then(m => m.TagPills),
        data: {
          title: 'Tag & Pills',
          breadcrumb: 'Tag & Pills',
        },
      },
      {
        path: 'progress-bar',
        loadComponent: () => import('./progress-bar/progress-bar').then(m => m.ProgressBar),
        data: {
          title: 'Progress Bar',
          breadcrumb: 'Progress Bar',
        },
      },
      {
        path: 'modal',
        loadComponent: () => import('./modal/modal').then(m => m.Modal),
        data: {
          title: 'Modal',
          breadcrumb: 'Modal',
        },
      },
      {
        path: 'alert',
        loadComponent: () => import('./alert/alert').then(m => m.Alert),
        data: {
          title: 'Alert',
          breadcrumb: 'Alert',
        },
      },
      {
        path: 'popover',
        loadComponent: () => import('./popover/popover').then(m => m.Popover),
        data: {
          title: 'Popover',
          breadcrumb: 'Popover',
        },
      },
      {
        path: 'tooltip',
        loadComponent: () => import('./tooltip/tooltip').then(m => m.Tooltip),
        data: {
          title: 'Tooltip',
          breadcrumb: 'Tooltip',
        },
      },
      {
        path: 'dropdown',
        loadComponent: () => import('./dropdown/dropdown').then(m => m.Dropdown),
        data: {
          title: 'Dropdown',
          breadcrumb: 'Dropdown',
        },
      },
      {
        path: 'according',
        loadComponent: () => import('./accordion/accordion').then(m => m.Accordion),
        data: {
          title: 'Accordion',
          breadcrumb: 'Accordion',
        },
      },
      {
        path: 'tabs',
        loadComponent: () => import('./tabs/tabs').then(m => m.Tabs),
        data: {
          title: 'Bootstrap Tabs',
          breadcrumb: 'Bootstrap Tabs',
        },
      },
      {
        path: 'lists',
        loadComponent: () => import('./lists/lists').then(m => m.Lists),
        data: {
          title: 'Lists',
          breadcrumb: 'Lists',
        },
      },
    ],
  },
];

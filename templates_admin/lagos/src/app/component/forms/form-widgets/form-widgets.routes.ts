import { Routes } from '@angular/router';

export const FormWidgets: Routes = [
  {
    path: '',
    children: [
      {
        path: 'datepicker',
        loadComponent: () => import('./date-picker/date-picker').then(m => m.DatePicker),
        data: {
          title: 'Datepicker',
          breadcrumb: 'Datepicker',
        },
      },
      {
        path: 'touchspin',
        loadComponent: () => import('./touchspin/touchspin').then(m => m.Touchspin),
        data: {
          title: 'Touchspin',
          breadcrumb: 'Touchspin',
        },
      },
      {
        path: 'select2',
        loadComponent: () => import('./select-two/select-two').then(m => m.SelectTwo),
        data: {
          title: 'Select2',
          breadcrumb: 'Select2',
        },
      },
      {
        path: 'switch',
        loadComponent: () => import('./switch/switch').then(m => m.Switch),
        data: {
          title: 'Switch',
          breadcrumb: 'Switch',
        },
      },
      {
        path: 'typeahead',
        loadComponent: () => import('./typeahead/typeahead').then(m => m.Typeahead),
        data: {
          title: 'Typeahead',
          breadcrumb: 'Typeahead',
        },
      },
      {
        path: 'clipboard',
        loadComponent: () => import('./clip-board/clip-board').then(m => m.ClipBoard),
        data: {
          title: 'Clipboard',
          breadcrumb: 'Clipboard',
        },
      },
    ],
  },
];

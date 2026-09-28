import { Routes } from '@angular/router';

export const CommingSoonPages: Routes = [
  {
    path: '',
    children: [
      {
        path: 'coming-simple',
        loadComponent: () =>
          import('./coming-soon-simple/coming-soon-simple').then(m => m.ComingSoonSimple),
      },
      {
        path: 'coming-with-bg-video',
        loadComponent: () =>
          import('./coming-soon-video/coming-soon-video').then(m => m.ComingSoonVideo),
      },
      {
        path: 'coming-with-bg-image',
        loadComponent: () =>
          import('./coming-soon-image/coming-soon-image').then(m => m.ComingSoonImage),
      },
    ],
  },
];

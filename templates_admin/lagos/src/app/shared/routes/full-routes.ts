import { Routes } from '@angular/router';

export const fullRoutes: Routes = [
  {
    path: 'error-page',
    loadChildren: () => import('../../pages/error-pages/error.routes').then(r => r.ErrorPages),
  },
  {
    path: 'authentication',
    loadChildren: () =>
      import('../../pages/authentication/authentication.routes').then(r => r.AuthenticationPages),
  },
  {
    path: 'coming-soon',
    loadChildren: () =>
      import('../../pages/coming-soon/coming-soon.routes').then(r => r.CommingSoonPages),
  },
];

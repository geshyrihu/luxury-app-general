import { Routes } from '@angular/router';

export const AuthenticationPages: Routes = [
  {
    path: '',
    children: [
      {
        path: 'simple',
        loadComponent: () => import('./login-simple/login-simple').then(m => m.LoginSimple),
      },
      {
        path: 'image-one',
        loadComponent: () => import('./login-bg-image/login-bg-image').then(m => m.LoginBgImage),
      },
      {
        path: 'image-two',
        loadComponent: () => import('./login-two-image/login-two-image').then(m => m.LoginTwoImage),
      },
      {
        path: 'validation',
        loadComponent: () =>
          import('./login-validation/login-validation').then(m => m.LoginValidation),
      },
      {
        path: 'tooltip',
        loadComponent: () => import('./login-tooltip/login-tooltip').then(m => m.LoginTooltip),
      },
      {
        path: 'login-sweetalert',
        loadComponent: () =>
          import('./login-sweetalert2/login-sweetalert2').then(m => m.LoginSweetalert2),
      },
      {
        path: 'register-simple',
        loadComponent: () =>
          import('./register-simple/register-simple').then(m => m.RegisterSimple),
      },
      {
        path: 'register-image-one',
        loadComponent: () =>
          import('./register-bg-image/register-bg-image').then(m => m.RegisterBgImage),
      },
      {
        path: 'register-image-two',
        loadComponent: () =>
          import('./register-with-two-image/register-with-two-image').then(
            m => m.RegisterWithTwoImage,
          ),
      },
      {
        path: 'unlock-user',
        loadComponent: () => import('./unlock-user/unlock-user').then(m => m.UnlockUser),
      },
      {
        path: 'forget-password',
        loadComponent: () =>
          import('./forgot-password/forgot-password').then(m => m.ForgotPassword),
      },
      {
        path: 'reset-password',
        loadComponent: () => import('./reset-password/reset-password').then(m => m.ResetPassword),
      },
      {
        path: 'maintenance',
        loadComponent: () => import('./maintenance/maintenance').then(m => m.Maintenance),
      },
    ],
  },
];

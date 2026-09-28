import { Routes } from '@angular/router';

export const User: Routes = [
  {
    path: '',
    children: [
      {
        path: 'users-profile',
        loadComponent: () => import('./user-profile/user-profile').then(m => m.UserProfile),
        data: {
          title: 'User Profile',
          breadcrumb: 'User Profile',
        },
      },
      {
        path: 'edit-profile',
        loadComponent: () => import('./users-edits/users-edits').then(m => m.UsersEdits),
        data: {
          title: 'Edit Profile',
          breadcrumb: 'Edit Profile',
        },
      },
      {
        path: 'users-cards',
        loadComponent: () => import('./user-cards/user-cards').then(m => m.UserCards),
        data: {
          title: 'User Cards',
          breadcrumb: 'User Cards',
        },
      },
    ],
  },
];

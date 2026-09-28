import { Routes } from '@angular/router';

export const Chat: Routes = [
  {
    path: '',
    children: [
      {
        path: 'private-chat',
        loadComponent: () => import('./private-chat/private-chat').then(m => m.PrivateChat),
        data: {
          title: 'Private Chat',
          breadcrumb: 'Private Chat',
        },
      },
      {
        path: 'group-chat',
        loadComponent: () => import('./group-chat/group-chat').then(m => m.GroupChat),
        data: {
          title: 'Group Chat',
          breadcrumb: 'Group Chat',
        },
      },
    ],
  },
];

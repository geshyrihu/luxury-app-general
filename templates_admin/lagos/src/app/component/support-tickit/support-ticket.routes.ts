import { Routes } from '@angular/router';

export const SupportTicket: Routes = [
  {
    path: '',
    loadComponent: () => import('./support-tickit').then(m => m.SupportTickit),
    data: {
      breadcrumb: 'Support Ticket',
    },
  },
];

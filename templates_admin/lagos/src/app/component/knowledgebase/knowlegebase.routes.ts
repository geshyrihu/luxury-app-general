import { Routes } from '@angular/router';

export const Knowledgebases: Routes = [
  {
    path: '',
    loadComponent: () => import('./knowledgebase').then(m => m.Knowledgebase),
  },
];

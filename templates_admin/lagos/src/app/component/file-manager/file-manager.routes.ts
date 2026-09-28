import { Routes } from '@angular/router';

export const FileManagers: Routes = [
  {
    path: '',
    loadComponent: () => import('./file-manager').then(m => m.FileManager),
  },
];

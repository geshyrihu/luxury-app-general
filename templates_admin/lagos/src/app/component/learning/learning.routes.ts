import { Routes } from '@angular/router';

export const Learning: Routes = [
  {
    path: 'learinng-list',
    loadComponent: () => import('./learning-list/learning-list').then(m => m.LearningList),
    data: {
      title: 'Learning List',
      breadcrumb: 'Learning List',
    },
  },
  {
    path: 'detailed-course',
    loadComponent: () => import('./detailed-course/detailed-course').then(m => m.DetailedCourse),
    data: {
      title: 'Detailed Course',
      breadcrumb: 'Detailed Course',
    },
  },
];

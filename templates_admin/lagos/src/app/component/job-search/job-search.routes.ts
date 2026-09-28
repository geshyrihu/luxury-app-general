import { Routes } from '@angular/router';

export const JobSearch: Routes = [
  {
    path: '',
    children: [
      {
        path: 'cards-view',
        loadComponent: () =>
          import('./job-search-cardview/job-search-cardview').then(m => m.JobSearchCardview),
        data: {
          title: 'Cards View',
          breadcrumb: 'Cards View',
        },
      },
      {
        path: 'list-view',
        loadComponent: () =>
          import('./job-search-listview/job-search-listview').then(m => m.JobSearchListview),
        data: {
          title: 'List View',
          breadcrumb: 'List View',
        },
      },
      {
        path: 'job-details',
        loadComponent: () => import('./job-details/job-details').then(m => m.JobDetails),
        data: {
          title: 'Job Details',
          breadcrumb: 'Job Details',
        },
      },
      {
        path: 'apply',
        loadComponent: () => import('./job-apply/job-apply').then(m => m.JobApply),
        data: {
          title: 'Apply',
          breadcrumb: 'Apply',
        },
      },
    ],
  },
];

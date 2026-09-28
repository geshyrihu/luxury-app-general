import { Routes } from '@angular/router';

export const Blog: Routes = [
  {
    path: '',
    children: [
      {
        path: 'blog-grids',
        loadComponent: () => import('./blog-grids/blog-grids').then(m => m.BlogGrids),
        data: {
          title: 'Blog Grids',
          breadcrumb: 'Blog Grids',
        },
      },
      {
        path: 'blog-details',
        loadComponent: () => import('./blog-details/blog-details').then(m => m.BlogDetails),
        data: {
          title: 'Blog Details',
          breadcrumb: 'Blog Details',
        },
      },
      {
        path: 'add-post',
        loadComponent: () => import('./add-post/add-post').then(m => m.AddPost),
        data: {
          title: 'Add Post',
          breadcrumb: 'Add Post',
        },
      },
    ],
  },
];

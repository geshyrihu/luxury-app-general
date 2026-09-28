import { Routes } from '@angular/router';

export const BonusUi: Routes = [
  {
    path: '',
    children: [
      {
        path: 'toasts',
        loadComponent: () => import('./toasts/toasts').then(m => m.Toasts),
        data: {
          title: 'Toasts',
          breadcrumb: 'Toasts',
        },
      },
      {
        path: 'rating',
        loadComponent: () => import('./rating/rating').then(m => m.Rating),
        data: {
          title: 'Rating',
          breadcrumb: 'Rating',
        },
      },
      {
        path: 'dropzone',
        loadComponent: () => import('./dropzone/dropzone').then(m => m.Dropzone),
        data: {
          title: 'Dropzone',
          breadcrumb: 'Dropzone',
        },
      },
      {
        path: 'sweetalert2',
        loadComponent: () => import('./sweet-alert/sweet-alert').then(m => m.SweetAlert),
        data: {
          title: 'Sweet Alert',
          breadcrumb: 'Sweet Alert',
        },
      },
      {
        path: 'owl-carousel',
        loadComponent: () => import('./owl-carousel/owl-carousel').then(m => m.OwlCarousel),
        data: {
          title: 'Owl Carousel',
          breadcrumb: 'Owl Carousel',
        },
      },
      {
        path: 'ribbons',
        loadComponent: () => import('./ribbons/ribbons').then(m => m.Ribbons),
        data: {
          title: 'Ribbons',
          breadcrumb: 'Ribbons',
        },
      },
      {
        path: 'pagination',
        loadComponent: () => import('./paginations/paginations').then(m => m.Paginations),
        data: {
          title: 'Paginations',
          breadcrumb: 'Paginations',
        },
      },
      {
        path: 'breadcrumb-ui',
        loadComponent: () => import('./breadcrumb/breadcrumb').then(m => m.Breadcrumb),
        data: {
          title: 'Breadcrumb',
          breadcrumb: 'Breadcrumb',
        },
      },
      {
        path: 'range-slider',
        loadComponent: () => import('./range-slider/range-slider').then(m => m.RangeSlider),
        data: {
          title: 'Range Slider',
          breadcrumb: 'Range Slider',
        },
      },
      {
        path: 'image-cropper',
        loadComponent: () => import('./image-cropper/image-cropper').then(m => m.ImageCropper),
        data: {
          title: 'Image Cropper',
          breadcrumb: 'Image Cropper',
        },
      },
      {
        path: 'basic-card',
        loadComponent: () => import('./basic-card/basic-card').then(m => m.BasicCard),
        data: {
          title: 'Basic Card',
          breadcrumb: 'Basic Card',
        },
      },
      {
        path: 'creative-card',
        loadComponent: () => import('./creative-cards/creative-cards').then(m => m.CreativeCards),
        data: {
          title: 'Creative Card',
          breadcrumb: 'Creative Card',
        },
      },
      {
        path: 'timeline',
        loadComponent: () => import('./time-line/time-line').then(m => m.TimeLine),
        data: {
          title: 'Time Line',
          breadcrumb: 'Time Line',
        },
      },
    ],
  },
];

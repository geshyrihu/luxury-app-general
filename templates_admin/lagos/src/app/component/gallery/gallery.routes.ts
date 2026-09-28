import { Routes } from '@angular/router';

export const Gallery: Routes = [
  {
    path: '',
    children: [
      {
        path: 'gallary-grid',
        loadComponent: () => import('./gallery-grid/gallery-grid').then(m => m.GalleryGrid),
        data: {
          title: 'Gallery',
          breadcrumb: 'Gallery',
        },
      },
      {
        path: 'gallery-grid-desc',
        loadComponent: () =>
          import('./gallery-grid-with-desc/gallery-grid-with-desc').then(
            m => m.GalleryGridWithDesc,
          ),
        data: {
          title: 'Gallery Grid With Description',
          breadcrumb: 'Gallery Grid With Description',
        },
      },
      {
        path: 'masonry-gallery',
        loadComponent: () =>
          import('./masonry-gallery/masonry-gallery').then(m => m.MasonryGallery),
        data: {
          title: 'Masonry Gallery',
          breadcrumb: 'Masonry Gallery',
        },
      },
      {
        path: 'masonry-with-desc',
        loadComponent: () =>
          import('./masonry-gallery-with-desc/masonry-gallery-with-desc').then(
            m => m.MasonryGalleryWithDesc,
          ),
        data: {
          title: 'Masonry Gallery With Description',
          breadcrumb: 'Masonry Gallery With Description',
        },
      },
      {
        path: 'hover-effects',
        loadComponent: () =>
          import('./image-hover-effects/image-hover-effects').then(m => m.ImageHoverEffects),
        data: {
          title: 'Image Hover Effects',
          breadcrumb: 'Image Hover Effects',
        },
      },
    ],
  },
];

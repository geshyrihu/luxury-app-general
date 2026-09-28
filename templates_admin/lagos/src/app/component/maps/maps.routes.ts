import { Routes } from '@angular/router';

export const Maps: Routes = [
  {
    path: '',
    children: [
      {
        path: 'google-map',
        loadComponent: () => import('./google-map/google-map').then(m => m.GoogleMaps),
        data: {
          title: 'Google Map',
          breadcrumb: 'Google Map',
        },
      },
      {
        path: 'leaflet-map',
        loadComponent: () => import('./leaflet-map/leaflet-map').then(m => m.LeafletMap),
        data: {
          title: 'Leaflet Map',
          breadcrumb: 'Leaflet Map',
        },
      },
    ],
  },
];

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  public customize: string = '';
  public margin = 0;

  public config = {
    settings: {
      layout_type: 'ltr',
      layout_version: 'dark-sidebar',
      sidebar_type: 'compact-wrapper',
      icon: 'stroke-svg',
    },
    color: {
      primary_color: '#6f5a99',
      secondary_color: '#e24175',
    },
  };

  constructor() {}
}

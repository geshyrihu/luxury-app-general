import { Component, viewChild } from '@angular/core';

import { LightboxModule } from 'ng-gallery/lightbox';
import { NgxMasonryComponent, NgxMasonryModule, NgxMasonryOptions } from 'ngx-masonry';

import { masonryGalleryGridWithDesc } from '../../../shared/data/data/gallery/gallery';

@Component({
  selector: 'app-masonry-gallery-with-desc',
  templateUrl: './masonry-gallery-with-desc.html',
  styleUrls: ['./masonry-gallery-with-desc.scss'],
  imports: [NgxMasonryModule, LightboxModule],
})
export class MasonryGalleryWithDesc {
  public masonryOptions: NgxMasonryOptions = {
    gutter: 20,
  };

  readonly masonry = viewChild(NgxMasonryComponent);

  public limit = 20;

  public masonryGalleryGridWithDesc = masonryGalleryGridWithDesc;
}

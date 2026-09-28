import { Component, inject } from '@angular/core';

import {
  Gallery,
  GalleryItem,
  GalleryModule,
  ImageItem,
  ImageSize,
  ThumbnailsPosition,
} from 'ng-gallery';
import { Lightbox, LightboxModule } from 'ng-gallery/lightbox';

import * as data from '../../../shared/data/data/social-app/social-app';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.html',
  styleUrls: ['./photo.scss'],
  imports: [GalleryModule, LightboxModule],
})
export class Photo {
  public photosData = data.photosData;
  public items: GalleryItem[];

  public gallery = inject(Gallery);
  public lightbox = inject(Lightbox);

  ngOnInit() {
    this.items = this.photosData.map(
      item => new ImageItem({ src: item.srcUrl, thumb: item.previewUrl }),
    );

    const lightboxRef = this.gallery.ref('lightbox');

    lightboxRef.setConfig({
      imageSize: ImageSize.Cover,
      thumbPosition: ThumbnailsPosition.Top,
    });

    lightboxRef.load(this.items);
  }
}

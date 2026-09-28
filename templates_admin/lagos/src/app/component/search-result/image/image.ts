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
  selector: 'app-image',
  templateUrl: './image.html',
  styleUrls: ['./image.scss'],
  imports: [GalleryModule, LightboxModule],
})
export class Image {
  public photosData = data.photosData;
  public items: GalleryItem[];
  public gallery = inject(Gallery);
  public lightbox = inject(Lightbox);

  ngOnInit() {
    /** Basic Gallery Example */

    // Creat gallery items
    this.items = this.photosData.map(
      item => new ImageItem({ src: item.srcUrl, thumb: item.previewUrl }),
    );

    /** Lightbox Example */

    // Get a lightbox gallery ref
    const lightboxRef = this.gallery.ref('lightbox');

    // Add custom gallery config to the lightbox (optional)
    lightboxRef.setConfig({
      imageSize: ImageSize.Cover,
      thumbPosition: ThumbnailsPosition.Top,
    });

    // Load items into the lightbox gallery ref
    lightboxRef.load(this.items);
  }
}

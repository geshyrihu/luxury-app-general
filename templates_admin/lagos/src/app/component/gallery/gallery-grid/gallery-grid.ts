import { SlicePipe } from '@angular/common';
import { Component } from '@angular/core';

import { GalleryModule } from 'ng-gallery';
import { LightboxModule } from 'ng-gallery/lightbox';

import { galleryGridData } from '../../../shared/data/data/gallery/gallery';

@Component({
  selector: 'app-gallery-grid',
  templateUrl: './gallery-grid.html',
  styleUrls: ['./gallery-grid.scss'],
  imports: [LightboxModule, GalleryModule, SlicePipe],
})
export class GalleryGrid {
  public galleryGridData = galleryGridData;
}

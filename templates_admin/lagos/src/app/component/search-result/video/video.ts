import { Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import * as data from '../../../shared/data/data/search-result/search-result';

@Component({
  selector: 'app-video',
  templateUrl: './video.html',
  styleUrls: ['./video.scss'],
  imports: [],
})
export class Video {
  public videosData = data.videosData;

  public sanitizer = inject(DomSanitizer);

  safe(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}

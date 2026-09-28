import { NgClass } from '@angular/common';
import { Component } from '@angular/core';

import { All } from './all/all';
import { Image } from './image/image';
import { Video } from './video/video';
import { FeatherIcons } from '../../shared/components/feather-icons/feather-icons';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.html',
  styleUrls: ['./search-result.scss'],
  imports: [FeatherIcons, Video, Image, All, NgClass],
})
export class SearchResult {
  public openTab: string = 'all';

  tabbed(val: string) {
    this.openTab = val;
  }
}

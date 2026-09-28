import { Component, input } from '@angular/core';

import { FeatherIcons } from '../../../shared/components/feather-icons/feather-icons';
import { articlesAndVideos } from '../../../shared/data/data/faq/faq';

@Component({
  selector: 'app-latest-articles-videos',
  templateUrl: './latest-articles-videos.html',
  styleUrls: ['./latest-articles-videos.scss'],
  imports: [FeatherIcons],
})
export class LatestArticlesVideos {
  readonly data = input<articlesAndVideos[]>();
}

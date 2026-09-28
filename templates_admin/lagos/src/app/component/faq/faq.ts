import { Component } from '@angular/core';

import { CommanData } from './comman-data/comman-data';
import { FeaturedTutorials } from './featured-tutorials/featured-tutorials';
import { LatestArticlesVideos } from './latest-articles-videos/latest-articles-videos';
import { LatestUpdates } from './latest-updates/latest-updates';
import { Navigation } from './navigation/navigation';
import { Questions } from './questions/questions';
import { SearchArticles } from './search-articles/search-articles';
import {
  featuredTutorialData,
  articlesAndVideosData,
  commanTopData,
} from '../../shared/data/data/faq/faq';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.html',
  styleUrls: ['./faq.scss'],
  imports: [
    CommanData,
    Questions,
    SearchArticles,
    Navigation,
    LatestUpdates,
    FeaturedTutorials,
    LatestArticlesVideos,
  ],
})
export class Faq {
  public commanData = commanTopData;
  public featuredTutorialData = featuredTutorialData;
  public articlesAndVideosData = articlesAndVideosData;
}

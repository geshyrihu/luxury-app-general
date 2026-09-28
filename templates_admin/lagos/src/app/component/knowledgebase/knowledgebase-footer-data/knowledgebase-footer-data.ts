import { Component } from '@angular/core';

import {
  articlesAndVideosData,
  featuredTutorialData,
} from '../../../shared/data/data/knowladgebase/knowladgebase';
import { FeaturedTutorials } from '../../faq/featured-tutorials/featured-tutorials';
import { LatestArticlesVideos } from '../../faq/latest-articles-videos/latest-articles-videos';

@Component({
  selector: 'app-knowledgebase-footer-data',
  templateUrl: './knowledgebase-footer-data.html',
  styleUrls: ['./knowledgebase-footer-data.scss'],
  imports: [FeaturedTutorials, LatestArticlesVideos],
})
export class KnowledgebaseFooterData {
  public featuredTutorialData = featuredTutorialData;
  public articlesAndVideosData = articlesAndVideosData;
}

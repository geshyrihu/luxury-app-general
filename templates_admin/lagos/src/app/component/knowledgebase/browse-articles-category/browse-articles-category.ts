import { Component } from '@angular/core';

import { FeatherIcons } from '../../../shared/components/feather-icons/feather-icons';
import { browseArticlesData } from '../../../shared/data/data/knowladgebase/knowladgebase';

@Component({
  selector: 'app-browse-articles-category',
  templateUrl: './browse-articles-category.html',
  styleUrls: ['./browse-articles-category.scss'],
  imports: [FeatherIcons],
})
export class BrowseArticlesCategory {
  public browseArticlesData = browseArticlesData;
}

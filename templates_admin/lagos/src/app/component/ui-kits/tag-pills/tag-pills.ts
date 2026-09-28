import { Component } from '@angular/core';

import { BadgeHeadingsExample } from './badge-headings-example/badge-headings-example';
import { BadgesAsPartButtons } from './badges-as-part-buttons/badges-as-part-buttons';
import { CommanTagPills } from './comman-tag-pills/comman-tag-pills';
import * as data from '../../../shared/data/data/ui-kits/tag-pills';

@Component({
  selector: 'app-tag-pills',
  templateUrl: './tag-pills.html',
  styleUrls: ['./tag-pills.scss'],
  imports: [BadgeHeadingsExample, BadgesAsPartButtons, CommanTagPills],
})
export class TagPills {
  public commonTagPillsData = data.commonTagPillsData;
}

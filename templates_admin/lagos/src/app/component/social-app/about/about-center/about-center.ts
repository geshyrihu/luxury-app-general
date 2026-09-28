import { Component } from '@angular/core';

import { FeatherIcons } from '../../../../shared/components/feather-icons/feather-icons';
import * as data from '../../../../shared/data/data/social-app/social-app';

@Component({
  selector: 'app-about-center',
  templateUrl: './about-center.html',
  styleUrls: ['./about-center.scss'],
  imports: [FeatherIcons],
})
export class AboutCenter {
  public peopleKnowYouData = data.peopleKnowYouData;
  public hobbiedAndInterestData = data.hobbiedAndInterestData;
  public eductionData = data.eductionData;
  public activityLog = data.activityLog;
}

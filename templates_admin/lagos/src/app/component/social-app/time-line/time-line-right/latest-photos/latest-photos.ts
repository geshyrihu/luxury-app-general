import { Component } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import * as data from '../../../../../shared/data/data/social-app/social-app';

@Component({
  selector: 'app-latest-photos',
  templateUrl: './latest-photos.html',
  styleUrls: ['./latest-photos.scss'],
  imports: [NgbModule],
})
export class LatestPhotos {
  public isCollapsed = false;
  public latestPhotos = data.latestPhotos;
}

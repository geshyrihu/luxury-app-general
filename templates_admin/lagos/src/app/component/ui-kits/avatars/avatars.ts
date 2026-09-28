import { Component } from '@angular/core';

import { CommonAvatars } from './common-avatars/common-avatars';
import { Grouping } from './grouping/grouping';
import * as data from '../../../shared/data/data/ui-kits/avatars';

@Component({
  selector: 'app-avatars',
  templateUrl: './avatars.html',
  styleUrls: ['./avatars.scss'],
  imports: [CommonAvatars, Grouping],
})
export class Avatars {
  public sizingData = data.sizesAvtarData;
  public statusIndicatorData = data.statusIndicatorData;
  public shapeData = data.shapeData;
  public ratioData = data.ratioData;
}

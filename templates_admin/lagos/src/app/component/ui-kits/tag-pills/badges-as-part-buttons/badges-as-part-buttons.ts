import { Component } from '@angular/core';

import { FeatherIcons } from '../../../../shared/components/feather-icons/feather-icons';
import * as Data from '../../../../shared/data/data/ui-kits/tag-pills';

@Component({
  selector: 'app-badges-as-part-buttons',
  templateUrl: './badges-as-part-buttons.html',
  styleUrls: ['./badges-as-part-buttons.scss'],
  imports: [FeatherIcons],
})
export class BadgesAsPartButtons {
  public badgeButtonData = Data.badgeButtonData;
}

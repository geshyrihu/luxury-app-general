import { Component, input } from '@angular/core';

import { FeatherIcons } from '../../../../shared/components/feather-icons/feather-icons';
import * as data from '../../../../shared/data/data/ui-kits/tag-pills';

@Component({
  selector: 'app-comman-tag-pills',
  templateUrl: './comman-tag-pills.html',
  styleUrls: ['./comman-tag-pills.scss'],
  imports: [FeatherIcons],
})
export class CommanTagPills {
  readonly data = input<data.commonTagPills[]>();
}

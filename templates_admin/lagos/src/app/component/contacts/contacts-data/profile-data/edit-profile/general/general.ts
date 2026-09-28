import { Component, input } from '@angular/core';

import * as data from '../../../../../../shared/data/data/contacts/contacts';

@Component({
  selector: 'app-general',
  templateUrl: './general.html',
  styleUrls: ['./general.scss'],
  imports: [],
})
export class General {
  readonly profileData = input<data.dataList>();
}

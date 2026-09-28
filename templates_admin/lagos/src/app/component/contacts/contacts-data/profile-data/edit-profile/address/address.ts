import { Component, input } from '@angular/core';

import * as data from '../../../../../../shared/data/data/contacts/contacts';

@Component({
  selector: 'app-address',
  templateUrl: './address.html',
  styleUrls: ['./address.scss'],
  imports: [],
})
export class Address {
  readonly profileData = input<data.dataList>();
}

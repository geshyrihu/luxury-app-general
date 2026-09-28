import { Component, input } from '@angular/core';

import { FeatherIcons } from '../../../shared/components/feather-icons/feather-icons';
import { commanData } from '../../../shared/data/data/faq/faq';

@Component({
  selector: 'app-comman-data',
  templateUrl: './comman-data.html',
  styleUrls: ['./comman-data.scss'],
  imports: [FeatherIcons],
})
export class CommanData {
  readonly data = input<commanData[]>();
}

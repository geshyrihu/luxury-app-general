import { Component } from '@angular/core';

import * as data from '../../../../shared/data/data/ui-kits/helper-class';

@Component({
  selector: 'app-margin',
  templateUrl: './margin.html',
  styleUrls: ['./margin.scss'],
  imports: [],
})
export class Margin {
  public margin = data.margin;
}

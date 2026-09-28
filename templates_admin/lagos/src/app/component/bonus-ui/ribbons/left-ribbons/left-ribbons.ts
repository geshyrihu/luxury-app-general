import { Component } from '@angular/core';

import { leftRinnobsData } from '../../../../shared/data/data/bonus-ui/ribbons';

@Component({
  selector: 'app-left-ribbons',
  templateUrl: './left-ribbons.html',
  styleUrls: ['./left-ribbons.scss'],
  imports: [],
})
export class LeftRibbons {
  public leftRinnobsData = leftRinnobsData;
}

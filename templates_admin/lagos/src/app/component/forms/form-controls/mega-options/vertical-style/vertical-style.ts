import { Component } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import * as data from '../../../../../shared/data/data/forms/forms-controls';

@Component({
  selector: 'app-vertical-style',
  templateUrl: './vertical-style.html',
  styleUrls: ['./vertical-style.scss'],
  imports: [NgbModule],
})
export class VerticalStyle {
  public verticalStyle = data.verticalStyle;
  public buyingOptionVertical = data.buyingOptionVertical;
}

import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CommonSvgIcon } from '../../../shared/components/common-svg-icon/common-svg-icon';
import * as data from '../../../shared/data/data/user/user';

@Component({
  selector: 'app-user-cards',
  templateUrl: './user-cards.html',
  styleUrls: ['./user-cards.scss'],
  imports: [CommonSvgIcon, RouterModule],
})
export class UserCards {
  public userCards = data.userCards;
}

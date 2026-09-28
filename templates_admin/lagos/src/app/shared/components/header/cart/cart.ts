import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CommonSvgIcon } from '../../common-svg-icon/common-svg-icon';
import { FeatherIcons } from '../../feather-icons/feather-icons';

@Component({
  selector: 'app-cart',
  imports: [FeatherIcons, RouterModule, CommonSvgIcon],
  templateUrl: './cart.html',
  styleUrls: ['./cart.scss'],
})
export class Cart {
  public isShow: boolean = false;
}

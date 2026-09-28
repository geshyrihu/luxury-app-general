import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CommonSvgIcon } from '../../common-svg-icon/common-svg-icon';

@Component({
  selector: 'app-notifications',
  imports: [CommonSvgIcon, RouterModule],
  templateUrl: './notifications.html',
  styleUrls: ['./notifications.scss'],
})
export class Notifications {
  public isShow: boolean = false;
}

import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CommonSvgIcon } from '../../common-svg-icon/common-svg-icon';

@Component({
  selector: 'app-messages',
  imports: [CommonSvgIcon, RouterModule],
  templateUrl: './messages.html',
  styleUrls: ['./messages.scss'],
})
export class Messages {
  public isShow: boolean = false;
}

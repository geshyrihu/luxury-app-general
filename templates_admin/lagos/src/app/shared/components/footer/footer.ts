import { Component } from '@angular/core';

import { CommonSvgIcon } from '../common-svg-icon/common-svg-icon';

@Component({
  selector: 'app-footer',
  imports: [CommonSvgIcon],
  templateUrl: './footer.html',
  styleUrls: ['./footer.scss'],
})
export class Footer {
  public year = new Date().getFullYear();
}

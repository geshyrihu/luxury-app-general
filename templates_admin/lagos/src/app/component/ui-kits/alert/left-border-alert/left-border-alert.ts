import { Component } from '@angular/core';

import { FeatherIcons } from '../../../../shared/components/feather-icons/feather-icons';

@Component({
  selector: 'app-left-border-alert',
  templateUrl: './left-border-alert.html',
  styleUrls: ['./left-border-alert.scss'],
  imports: [FeatherIcons],
})
export class LeftBorderAlert {
  public isShow: boolean = true;
}

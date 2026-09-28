import { Component } from '@angular/core';

import { FeatherIcons } from '../../../../shared/components/feather-icons/feather-icons';

@Component({
  selector: 'app-dismissing-dark-alert',
  templateUrl: './dismissing-dark-alert.html',
  styleUrls: ['./dismissing-dark-alert.scss'],
  imports: [FeatherIcons],
})
export class DismissingDarkAlert {
  public isShow: boolean = true;
}

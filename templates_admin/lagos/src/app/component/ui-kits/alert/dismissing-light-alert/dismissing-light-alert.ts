import { Component } from '@angular/core';

import { FeatherIcons } from '../../../../shared/components/feather-icons/feather-icons';

@Component({
  selector: 'app-dismissing-light-alert',
  templateUrl: './dismissing-light-alert.html',
  styleUrls: ['./dismissing-light-alert.scss'],
  imports: [FeatherIcons],
})
export class DismissingLightAlert {
  public isShow: boolean = true;
}

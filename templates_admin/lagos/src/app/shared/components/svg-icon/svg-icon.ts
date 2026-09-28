import { Component, inject, input } from '@angular/core';

import { LayoutService } from '../../services/layout.service';

@Component({
  selector: 'app-svg-icon',
  imports: [],
  templateUrl: './svg-icon.html',
  styleUrls: ['./svg-icon.scss'],
})
export class SvgIcon {
  public readonly icon = input<string>();
  public layoutService = inject(LayoutService);

  getSvgType() {
    return (
      document.getElementsByClassName('sidebar-wrapper')[0].getAttribute('icon') == 'stroke-svg'
    );
  }
}

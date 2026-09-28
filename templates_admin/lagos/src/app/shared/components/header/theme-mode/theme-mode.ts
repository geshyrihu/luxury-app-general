import { Component, inject } from '@angular/core';

import { LayoutService } from '../../../services/layout.service';
import { CommonSvgIcon } from '../../common-svg-icon/common-svg-icon';

@Component({
  selector: 'app-theme-mode',
  imports: [CommonSvgIcon],
  templateUrl: './theme-mode.html',
  styleUrls: ['./theme-mode.scss'],
})
export class ThemeMode {
  public layout = inject(LayoutService);
  public dark: boolean = this.layout.config.settings.layout_version == 'dark-only' ? true : false;

  layoutToggle() {
    this.dark = !this.dark;
    this.dark
      ? document.body.classList.add('dark-only')
      : document.body.classList.remove('dark-only');
    this.layout.config.settings.layout_version = this.dark ? 'dark-only' : 'light';
  }
}

import { Component, HostListener, inject } from '@angular/core';

import { LayoutService } from '../../../services/layout.service';

@Component({
  selector: 'app-quick-option',
  templateUrl: './quick-option.html',
  styleUrls: ['./quick-option.scss'],
})
export class QuickOption {
  public layoutType: string = 'ltr';
  public sidebarType: string = 'compact-wrapper';
  public icon: string = 'stroke-svg';
  public screenWidth = window.innerWidth;
  private layoutServices = inject(LayoutService);

  @HostListener('window:resize')
  onResize() {
    this.screenWidth = window.innerWidth;
  }

  customizeLayoutType(value: string) {
    this.layoutType = value;
    this.layoutServices.config.settings.layout_type = value;
    if (value == 'rtl') {
      document.getElementsByTagName('html')[0].setAttribute('dir', value);
      document.body.className = 'rtl';
    } else if (value == 'box-layout') {
      document.getElementsByTagName('html')[0].setAttribute('dir', value);
      document.body.className = 'box-layout';
    } else {
      document.getElementsByTagName('html')[0].removeAttribute('dir');
      document.body.className = '';
    }
    this.layoutServices.customize = '';
  }

  customizeSidebarType(value: string) {
    if (this.screenWidth < 1200) {
      if (value == 'horizontal-wrapper') {
        this.layoutServices.config.settings.sidebar_type = 'compact-wrapper';
      }
    } else {
      this.layoutServices.margin = 0;
      this.sidebarType = value;
      this.layoutServices.config.settings.sidebar_type = value;
      this.layoutServices.customize = '';
    }
  }

  svgIcon(val: string) {
    this.icon = val;
    this.layoutServices.config.settings.icon = val;
    if (val == 'stroke-svg') {
      document.getElementsByTagName('sidebar-wrapper')[0]?.setAttribute('icon', val);
    } else {
      document.getElementsByTagName('sidebar-wrapper')[0]?.setAttribute('icon', val);
    }
  }
}

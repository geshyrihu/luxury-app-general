import { Component, HostListener, inject } from '@angular/core';

import { HidescrollnavService } from '../../../shared/services/hidescrollnav.service';

@Component({
  selector: 'app-hide-scrool-nav',
  templateUrl: './hide-scrool-nav.html',
  styleUrls: ['./hide-scrool-nav.scss'],
  imports: [],
})
export class HideScroolNav {
  public hideScroolNavService = inject(HidescrollnavService);

  @HostListener('window:scroll', [])
  onWindowScroll() {
    let number = window.pageYOffset || 0;
    if (number > 252) {
      this.hideScroolNavService.headerFixed = true;
    } else {
      this.hideScroolNavService.headerFixed = false;
    }
  }
}

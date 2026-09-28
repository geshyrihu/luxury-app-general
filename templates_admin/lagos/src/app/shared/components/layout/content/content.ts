import { NgClass } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HidescrollnavService } from '../../../services/hidescrollnav.service';
import { LayoutService } from '../../../services/layout.service';
import { NavService } from '../../../services/nav.service';
import { Customizer } from '../../customozer/customizer';
import { Footer } from '../../footer/footer';
import { Header } from '../../header/header';
import { Sidebar } from '../../sidebar/sidebar';

@Component({
  selector: 'app-content',
  imports: [RouterOutlet, Header, Sidebar, Footer, Customizer, NgClass],
  templateUrl: './content.html',
  styleUrls: ['./content.scss'],
})
export class Content {
  public innerWidth: number;
  public footerFix = false;
  public footerLight = false;
  public footerDark: boolean = false;

  public hideScroolNavService: HidescrollnavService = inject(HidescrollnavService);
  public navService: NavService = inject(NavService);
  public layout: LayoutService = inject(LayoutService);

  ngOnInit() {
    this.innerWidth = window.innerWidth;
  }

  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth < 1200) {
      this.layout.config.settings.sidebar_type = 'page-wrapper compact-wrapper';
    }
  }

  get layoutClass() {
    return this.layout.config.settings.sidebar_type + '';
  }

  ngDoCheck() {
    if (window.location.pathname.includes('/page-layout/footer-dark')) {
      this.footerDark = true;
      this.footerLight = false;
      this.footerFix = false;
    } else if (window.location.pathname.includes('/page-layout/footer-light')) {
      this.footerLight = true;
      this.footerDark = false;
      this.footerFix = false;
    } else if (window.location.pathname.includes('/page-layout/footer-fixed')) {
      this.footerFix = true;
      this.footerLight = false;
      this.footerDark = false;
    }
  }

  ngOnDestroy() {
    this.footerDark = false;
  }
}

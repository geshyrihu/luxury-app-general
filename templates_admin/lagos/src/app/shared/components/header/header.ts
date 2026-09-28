import { SlicePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { Bookmark } from './bookmark/bookmark';
import { Cart } from './cart/cart';
import { Language } from './language/language';
import { Messages } from './messages/messages';
import { Notifications } from './notifications/notifications';
import { Profile } from './profile/profile';
import { Search } from './search/search';
import { ThemeMode } from './theme-mode/theme-mode';
import { HidescrollnavService } from '../../services/hidescrollnav.service';
import { NavService } from '../../services/nav.service';
import { SearchService } from '../../services/search.service';
import { Breadcrumb } from '../breadcrumb/breadcrumb';
import { CommonSvgIcon } from '../common-svg-icon/common-svg-icon';
import { FeatherIcons } from '../feather-icons/feather-icons';
import { SvgIcon } from '../svg-icon/svg-icon';

@Component({
  selector: 'app-header',
  imports: [
    Notifications,
    Profile,
    Bookmark,
    Messages,
    Search,
    Cart,
    Language,
    ThemeMode,
    CommonSvgIcon,
    RouterModule,
    SvgIcon,
    FeatherIcons,
    FormsModule,
    Breadcrumb,
    SlicePipe,
  ],
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
})
export class Header {
  public isFlip: boolean = false;
  public isSearchOpen: boolean = false;
  public open: boolean = false;

  public navService = inject(NavService);
  public hideScroolNavService = inject(HidescrollnavService);
  public searchService = inject(SearchService);

  constructor() {}

  sidebarToggle() {
    this.navService.collapseSidebar = !this.navService.collapseSidebar;
  }
}

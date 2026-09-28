import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { RootReducerState } from 'src/app/store';
import {
  changeLayoutPosition,
  changeLayoutWidth,
  changeMode,
  changeSidebarMode,
  changeSidebarSize,
  changesLayout,
  changeTopbarMode,
} from 'src/app/store/layouts/layout.actions';
import { LayoutState } from 'src/app/store/layouts/layouts.reducer';
import { SIDEBAR_SIZE_TYPES } from 'src/app/store/layouts/layout';

@Component({
  selector: 'app-rightsidebar',
  templateUrl: './rightsidebar.component.html',
  styleUrls: ['./rightsidebar.component.scss'],
  standalone: false,
})
export class RightsidebarComponent implements OnInit {
  layout!: string | null;
  mode: 'light' | 'dark' = 'light';
  width: string = '';
  position: boolean = false;
  topbar: 'light' | 'dark' = 'light';
  sidebarcolor: 'light' | 'dark' | 'brand' = 'light';
  sidebarsize: string = SIDEBAR_SIZE_TYPES.DEFAULT;
  theme: string = '';

  constructor(private store: Store<RootReducerState>) { }

  ngOnInit(): void {
    // Subscribe to layout state once and keep DOM synced
    this.store.select('layout').subscribe((data: LayoutState) => {
      this.theme = data.DATA_LAYOUT;
      this.mode = data.LAYOUT_MODE as 'light' | 'dark';
      this.width = data.LAYOUT_WIDTH;
      this.topbar = (data.TOPBAR_TYPE as 'light' | 'dark') || 'light';
      this.sidebarcolor = (data.SIDEBAR_MODE as 'light' | 'dark') || 'light';
      this.sidebarsize = data.SIDEBAR_SIZE || SIDEBAR_SIZE_TYPES.DEFAULT;
      this.position = data.LAYOUT_POSITION ?? false;

      // Update DOM attributes
      document.body.setAttribute('data-bs-theme', this.mode);
      document.body.setAttribute('data-topbar', this.topbar);
      document.body.setAttribute('data-sidebar', this.sidebarcolor);
      document.body.setAttribute('data-sidebar-size', this.sidebarsize);
      document.body.setAttribute(
        'data-layout-scrollable',
        String(this.position)
      );
      document.body.setAttribute(
        'data-layout-position',
        this.position ? 'scrollable' : 'fixed'
      );
    });

    // Set layout toggle checked attribute
    this.layout = document.body.getAttribute('data-layout');
    const vertical = document.getElementById('is-layout');
    if (vertical) vertical.setAttribute('checked', 'true');
    if (this.layout === 'horizontal') vertical?.removeAttribute('checked');
  }

  // Hide sidebar
  hide() {
    document.body.classList.remove('right-bar-enabled');
  }

  // Toggle layout (vertical / horizontal)
  toggleLayout() {
    this.theme = this.theme === 'vertical' ? 'horizontal' : 'vertical';
    this.changeLayout(this.theme);
  }

  // Change layout
  changeLayout(layoutMode: string) {
    this.theme = layoutMode;
    this.store.dispatch(changesLayout({ layoutMode }));
  }

  // Change light / dark mode
  changeMode(mode: 'light' | 'dark') {
    this.store.dispatch(changeMode({ mode }));

    const topbarMode: 'light' | 'dark' = mode === 'dark' ? 'dark' : 'light';
    const sidebarMode: 'light' | 'dark' = mode === 'dark' ? 'dark' : 'light';

    // Update DOM
    document.body.setAttribute('data-bs-theme', mode);
    document.body.setAttribute('data-topbar', topbarMode);
    document.body.setAttribute('data-sidebar', sidebarMode);

    // Update local state
    this.mode = mode;
    this.topbar = topbarMode;
    this.sidebarcolor = sidebarMode;

    // Update theme in NgRx
    this.store.dispatch(changeTopbarMode({ topbarmode: topbarMode }));
    this.store.dispatch(changeSidebarMode({ sidebarMode }));
  }

  // Change width
  changeWidth(layoutwidth: string) {
    this.width = layoutwidth;
    this.store.dispatch(changeLayoutWidth({ layoutWidth: this.width }));
  }

  // Change position scrollable / fixed
  changePosition(isScrollable: boolean) {
    this.position = isScrollable;
    this.store.dispatch(
      changeLayoutPosition({ layoutposition: this.position })
    );

    document.body.setAttribute('data-layout-scrollable', String(this.position));
    document.body.setAttribute(
      'data-layout-position',
      this.position ? 'scrollable' : 'fixed'
    );
  }

  // Change topbar color
  changeTopbar(topbarmode: 'light' | 'dark') {
    this.topbar = topbarmode;
    this.store.dispatch(changeTopbarMode({ topbarmode }));

    document.body.setAttribute('data-topbar', topbarmode);
  }

  // Change sidebar color
  changeSidebarColor(sidebarcolor: 'light' | 'dark' | 'brand') {
    this.sidebarcolor = sidebarcolor;
    this.store.dispatch(changeSidebarMode({ sidebarMode: this.sidebarcolor }));

    document.body.setAttribute('data-sidebar', this.sidebarcolor);
  }

  // Change sidebar size
  changeSidebarSize(sidebarsize: string) {
    this.sidebarsize = sidebarsize;
    this.store.dispatch(changeSidebarSize({ sidebarsize }));

    document.body.setAttribute('data-sidebar-size', this.sidebarsize);
  }
}

import { Component, inject, OnInit } from '@angular/core';
import { LayoutState } from '../store/layouts/layouts.reducer';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  standalone: false
})

/**
 * Layout Component
 */
export class LayoutComponent implements OnInit {
  layoutType: LayoutState['DATA_LAYOUT'] = ''
  private store = inject(Store);

  ngOnInit(): void {

    this.store.select('layout').subscribe((data: LayoutState) => {
      this.layoutType = data.DATA_LAYOUT
      document.body.setAttribute('data-bs-theme', data.LAYOUT_MODE);
      document.body.setAttribute('data-layout', data.DATA_LAYOUT);
      document.body.setAttribute('data-sidebar', data.SIDEBAR_MODE);
      document.body.setAttribute('data-topbar', data.TOPBAR_TYPE);
      document.body.setAttribute('data-sidebar-size', data.SIDEBAR_SIZE);
      document.body.setAttribute(
        'data-layout-scrollable',
        String(data.LAYOUT_POSITION)
      );
      document.body.setAttribute('data-layout-size', data.LAYOUT_WIDTH);

    });
  }

  /**
   * Check if the vertical layout is requested
   */
  isVerticalLayoutRequested() {
    return this.layoutType === 'vertical';
  }

  /**
   * Check if the horizontal layout is requested
   */
  isHorizontalLayoutRequested() {
    return this.layoutType === 'horizontal';
  }

}

import { Component, inject, OnInit } from '@angular/core';
import { RightsidebarComponent } from '../rightsidebar/rightsidebar.component';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-vertical',
  templateUrl: './vertical.component.html',
  styleUrls: ['./vertical.component.scss'],
  standalone: false
})

/**
 * Vertical Component
 */
export class VerticalComponent implements OnInit {
  isCondensed = false;

  constructor() { }

  ngOnInit(): void {
    document.body.setAttribute('data-layout', 'vertical');
  }

  /**
   * On mobile toggle button clicked
   */
  onToggleMobileMenu() {
    document.body.classList.toggle('sidebar-enable');
    const currentSIdebarSize = document.body.getAttribute("data-sidebar-size");
    if (window.screen.width >= 992) {
      if (currentSIdebarSize == null) {
        (document.body.getAttribute('data-sidebar-size') == null || document.body.getAttribute('data-sidebar-size') == "lg") ? document.body.setAttribute('data-sidebar-size', 'sm') : document.body.setAttribute('data-sidebar-size', 'lg')
      } else if (currentSIdebarSize == "md") {
        (document.body.getAttribute('data-sidebar-size') == "md") ? document.body.setAttribute('data-sidebar-size', 'sm') : document.body.setAttribute('data-sidebar-size', 'md')
      } else {
        (document.body.getAttribute('data-sidebar-size') == "sm") ? document.body.setAttribute('data-sidebar-size', 'lg') : document.body.setAttribute('data-sidebar-size', 'sm')
      }
    }
    this.isCondensed = !this.isCondensed;
  }

  /**
   * on settings button clicked from topbar
   */
  onSettingsButtonClicked() {
    document.body.classList.toggle('right-bar-enabled');
  }

}

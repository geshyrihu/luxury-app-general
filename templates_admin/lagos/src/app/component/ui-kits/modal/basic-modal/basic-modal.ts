import { Component, inject } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { OpenModalLagos } from './open-modal-lagos/open-modal-lagos';
import { ScrollingContent } from './scrolling-content/scrolling-content';
import { Simple } from './simple/simple';
import { TooltipsPopovers } from './tooltips-popovers/tooltips-popovers';

@Component({
  selector: 'app-basic-modal',
  templateUrl: './basic-modal.html',
  styleUrls: ['./basic-modal.scss'],
  imports: [],
})
export class BasicModal {
  private modal = inject(NgbModal);

  simpleModal() {
    this.modal.open(Simple);
  }

  scrollingModal() {
    this.modal.open(ScrollingContent);
  }

  tooltipPopoverModal() {
    this.modal.open(TooltipsPopovers, { centered: true });
  }

  lagosModal() {
    this.modal.open(OpenModalLagos);
  }
}

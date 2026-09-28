import { Component, inject } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { FeatherIcons } from '../../../../../shared/components/feather-icons/feather-icons';

@Component({
  selector: 'app-scrolling-content',
  templateUrl: './scrolling-content.html',
  styleUrls: ['./scrolling-content.scss'],
  imports: [FeatherIcons],
})
export class ScrollingContent {
  private modal = inject(NgbModal);

  close() {
    this.modal.dismissAll();
  }
}

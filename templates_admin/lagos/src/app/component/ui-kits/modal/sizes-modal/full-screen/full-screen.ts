import { Component, inject } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { FeatherIcons } from '../../../../../shared/components/feather-icons/feather-icons';
import * as Data from '../../../../../shared/data/data/ui-kits/ui-modal';

@Component({
  selector: 'app-full-screen',
  templateUrl: './full-screen.html',
  styleUrls: ['./full-screen.scss'],
  imports: [FeatherIcons],
})
export class FullScreen {
  public modalData = Data.modalData;
  private modal = inject(NgbModal);

  close() {
    this.modal.dismissAll();
  }
}

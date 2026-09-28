import { Component, inject } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { FeatherIcons } from '../../../../../shared/components/feather-icons/feather-icons';
import * as data from '../../../../../shared/data/data/ui-kits/ui-modal';

@Component({
  selector: 'app-fullscreen-modal-fl',
  templateUrl: './fullscreen-modal-fl.html',
  styleUrls: ['./fullscreen-modal-fl.scss'],
  imports: [FeatherIcons],
})
export class FullscreenModalFl {
  public commonFullScreenData = data.commonFullScreenData;

  private modal = inject(NgbModal);

  close() {
    this.modal.dismissAll();
  }
}

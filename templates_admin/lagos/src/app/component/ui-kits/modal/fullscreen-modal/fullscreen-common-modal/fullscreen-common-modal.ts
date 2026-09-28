import { Component, inject, Input } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { FeatherIcons } from '../../../../../shared/components/feather-icons/feather-icons';
import * as data from '../../../../../shared/data/data/ui-kits/ui-modal';

@Component({
  selector: 'app-fullscreen-common-modal',
  templateUrl: './fullscreen-common-modal.html',
  styleUrls: ['./fullscreen-common-modal.scss'],
  imports: [FeatherIcons],
})
export class FullscreenCommonModal {
  @Input() title: string;
  public commonFullScreenData = data.commonFullScreenSizeData;
  private modal = inject(NgbModal);

  close() {
    this.modal.dismissAll();
  }
}

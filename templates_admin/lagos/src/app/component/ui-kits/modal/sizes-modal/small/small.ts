import { Component, inject } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { FeatherIcons } from '../../../../../shared/components/feather-icons/feather-icons';
import * as Data from '../../../../../shared/data/data/ui-kits/ui-modal';

@Component({
  selector: 'app-small',
  templateUrl: './small.html',
  styleUrls: ['./small.scss'],
  imports: [FeatherIcons],
})
export class Small {
  public smallModalData = Data.smallModalData;

  private modal = inject(NgbModal);

  close() {
    this.modal.dismissAll();
  }
}

import { Component, inject } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { FeatherIcons } from '../../../../../shared/components/feather-icons/feather-icons';
import * as Data from '../../../../../shared/data/data/ui-kits/ui-modal';

@Component({
  selector: 'app-extra-large',
  templateUrl: './extra-large.html',
  styleUrls: ['./extra-large.scss'],
  imports: [FeatherIcons],
})
export class ExtraLarge {
  public modalData = Data.modalData;

  private modal = inject(NgbModal);

  close() {
    this.modal.dismissAll();
  }
}

import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { CommonSvgIcon } from '../../../../../shared/components/common-svg-icon/common-svg-icon';
import { FeatherIcons } from '../../../../../shared/components/feather-icons/feather-icons';

@Component({
  selector: 'app-balance-modal',
  templateUrl: './balance-modal.html',
  styleUrls: ['./balance-modal.scss'],
  imports: [CommonSvgIcon, FeatherIcons, RouterModule],
})
export class BalanceModal {
  private modal = inject(NgbModal);

  close() {
    this.modal.dismissAll();
  }
}

import { Component, inject } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { BalanceModal } from './balance-modal/balance-modal';
import { ProfileModal } from './profile-modal/profile-modal';
import { ResultModal } from './result-modal/result-modal';

@Component({
  selector: 'app-lagos-custom-modals',
  templateUrl: './lagos-custom-modals.html',
  styleUrls: ['./lagos-custom-modals.scss'],
  imports: [],
})
export class LagosCustomModals {
  private modal = inject(NgbModal);

  profileModal() {
    this.modal.open(ProfileModal, { centered: true });
  }

  resultModal() {
    this.modal.open(ResultModal, { centered: true });
  }

  balanceModal() {
    this.modal.open(BalanceModal, { centered: true });
  }
}

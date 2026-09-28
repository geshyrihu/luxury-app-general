import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { CommonSvgIcon } from '../../../../../shared/components/common-svg-icon/common-svg-icon';

@Component({
  selector: 'app-profile-modal',
  templateUrl: './profile-modal.html',
  styleUrls: ['./profile-modal.scss'],
  imports: [CommonSvgIcon, RouterModule],
})
export class ProfileModal {
  private modal = inject(NgbModal);

  close() {
    this.modal.dismissAll();
  }
}

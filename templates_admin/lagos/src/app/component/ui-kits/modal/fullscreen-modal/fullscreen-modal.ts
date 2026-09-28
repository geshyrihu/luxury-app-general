import { Component, inject } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { FullscreenCommonModal } from './fullscreen-common-modal/fullscreen-common-modal';
import { FullscreenModalFl } from './fullscreen-modal-fl/fullscreen-modal-fl';

@Component({
  selector: 'app-fullscreen-modal',
  templateUrl: './fullscreen-modal.html',
  styleUrls: ['./fullscreen-modal.scss'],
  imports: [],
})
export class FullscreenModal {
  public title = '';
  private modalService = inject(NgbModal);

  fullscreenModal() {
    this.modalService.open(FullscreenModalFl, { fullscreen: true });
  }

  fullscreenSMModal() {
    this.title = 'Full Screen Below sm';
    const modal = this.modalService.open(FullscreenCommonModal, {
      size: 'md',
    });
    modal.componentInstance.title = this.title;
  }

  fullscreenMDModal() {
    this.title = 'Full Screen Below md';
    const modal = this.modalService.open(FullscreenCommonModal, {
      size: 'md',
    });
    modal.componentInstance.title = this.title;
  }

  fullscreenLGModal() {
    this.title = 'Full Screen Below lg';
    const modal = this.modalService.open(FullscreenCommonModal, {
      size: 'lg',
    });
    modal.componentInstance.title = this.title;
  }

  fullscreenXLModal() {
    this.title = 'Full Screen Below xl';
    const modal = this.modalService.open(FullscreenCommonModal, {
      size: 'xl',
    });
    modal.componentInstance.title = this.title;
  }

  fullscreenXXLModal() {
    this.title = 'Full Screen Below xxl';
    const modal = this.modalService.open(FullscreenCommonModal, {
      size: 'xxl',
    });
    modal.componentInstance.title = this.title;
  }
}

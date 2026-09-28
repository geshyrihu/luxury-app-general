import { Component, inject } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ExtraLarge } from './extra-large/extra-large';
import { FullScreen } from './full-screen/full-screen';
import { Large } from './large/large';
import { Small } from './small/small';

@Component({
  selector: 'app-sizes-modal',
  templateUrl: './sizes-modal.html',
  styleUrls: ['./sizes-modal.scss'],
  imports: [],
})
export class SizesModal {
  private modal = inject(NgbModal);

  fullScreenModal() {
    this.modal.open(FullScreen, { fullscreen: true });
  }

  extraLargeModal() {
    this.modal.open(ExtraLarge, { size: 'xl' });
  }

  largeModal() {
    this.modal.open(Large, { size: 'lg' });
  }

  smallModal() {
    this.modal.open(Small, { size: 'sm' });
  }
}

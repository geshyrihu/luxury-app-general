import { Component } from '@angular/core';

import { BasicModal } from './basic-modal/basic-modal';
import { BetweenModals } from './between-modals/between-modals';
import { CenteredModal } from './centered-modal/centered-modal';
import { FullscreenModal } from './fullscreen-modal/fullscreen-modal';
import { LagosCustomModals } from './lagos-custom-modals/lagos-custom-modals';
import { SizesModal } from './sizes-modal/sizes-modal';
import { StaticBackdrop } from './static-backdrop/static-backdrop';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.html',
  styleUrls: ['./modal.scss'],
  imports: [
    BasicModal,
    BetweenModals,
    CenteredModal,
    SizesModal,
    StaticBackdrop,
    LagosCustomModals,
    FullscreenModal,
  ],
})
export class Modal {}

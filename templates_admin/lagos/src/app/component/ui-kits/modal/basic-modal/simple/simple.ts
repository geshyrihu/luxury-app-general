import { Component, inject } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { FeatherIcons } from '../../../../../shared/components/feather-icons/feather-icons';

@Component({
  selector: 'app-simple',
  templateUrl: './simple.html',
  styleUrls: ['./simple.scss'],
  imports: [FeatherIcons],
})
export class Simple {
  private modal = inject(NgbModal);

  close() {
    this.modal.dismissAll();
  }
}

import { Component, inject } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-new-contacts',
  templateUrl: './new-contacts.html',
  styleUrls: ['./new-contacts.scss'],
  imports: [],
})
export class NewContacts {
  public activeModal = inject(NgbActiveModal);
}

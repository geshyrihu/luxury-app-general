import { Component, inject } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-new-bookmarks',
  templateUrl: './new-bookmarks.html',
  styleUrls: ['./new-bookmarks.scss'],
  imports: [],
})
export class NewBookmarks {
  public activeModal = inject(NgbActiveModal);
}

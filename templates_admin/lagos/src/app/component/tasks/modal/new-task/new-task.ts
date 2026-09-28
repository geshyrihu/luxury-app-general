import { Component, inject } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.html',
  styleUrls: ['./new-task.scss'],
  imports: [],
})
export class NewTask {
  public activeModal = inject(NgbActiveModal);
}

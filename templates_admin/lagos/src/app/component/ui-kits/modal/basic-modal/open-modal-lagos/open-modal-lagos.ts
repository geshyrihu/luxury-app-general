import { Component } from '@angular/core';

@Component({
  selector: 'app-open-modal-lagos',
  templateUrl: './open-modal-lagos.html',
  styleUrls: ['./open-modal-lagos.scss'],
})
export class OpenModalLagos {
  public validate: boolean = false;

  public submit() {
    this.validate = !this.validate;
  }
}

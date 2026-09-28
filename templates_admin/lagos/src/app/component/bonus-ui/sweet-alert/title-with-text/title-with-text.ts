import { Component } from '@angular/core';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-title-with-text',
  templateUrl: './title-with-text.html',
  styleUrls: ['./title-with-text.scss'],
  imports: [],
})
export class TitleWithText {
  openAlert() {
    Swal.fire({
      title: "It's Magic!",
      text: 'Thank you for visiting Lagos theme',
      confirmButtonColor: 'var(--theme-default)',
    });
  }
}

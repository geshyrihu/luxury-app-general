import { Component } from '@angular/core';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-info-alert',
  templateUrl: './info-alert.html',
  styleUrls: ['./info-alert.scss'],
  imports: [],
})
export class InfoAlert {
  infoAlert() {
    Swal.fire({
      text: "Please Click on this button it's big surprise for you.",
      confirmButtonColor: 'var(--theme-default)',
    }).then(result => {
      if (result.isConfirmed) {
        Swal.fire({
          text: 'Thank you for visit Lagos theme: true',
          confirmButtonColor: 'var(--theme-default)',
        });
      }
    });
  }
}

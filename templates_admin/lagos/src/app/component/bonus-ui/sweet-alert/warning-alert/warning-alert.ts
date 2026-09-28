import { Component } from '@angular/core';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-warning-alert',
  templateUrl: './warning-alert.html',
  styleUrls: ['./warning-alert.scss'],
  imports: [],
})
export class WarningAlert {
  warningAlert() {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover this imaginary file!',
      showCancelButton: true,
      confirmButtonColor: 'var(--theme-default)',
      customClass: {
        cancelButton: 'order-1',
        confirmButton: 'order-2',
      },
    }).then(result => {
      if (result.isConfirmed) {
        Swal.fire({
          text: 'Poof! Your imaginary file has been deleted!',
          icon: 'success',
          confirmButtonColor: 'var(--theme-default)',
        });
      } else {
        Swal.fire({
          text: 'Your imaginary file is safe!',
          confirmButtonColor: 'var(--theme-default)',
        });
      }
    });
  }
}

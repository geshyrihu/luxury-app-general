import { Component } from '@angular/core';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-username-alert',
  templateUrl: './username-alert.html',
  styleUrls: ['./username-alert.scss'],
  imports: [],
})
export class UsernameAlert {
  usernameAlert() {
    Swal.fire({
      text: 'Please! Submit Your Username :',
      confirmButtonColor: 'var(--theme-default)',
      input: 'text',
    }).then(result => {
      if (result.value) {
        Swal.fire({
          text: 'Your name is :' + result.value,
          confirmButtonColor: 'var(--theme-default)',
        });
      }
    });
  }
}

import { Component } from '@angular/core';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-basic-example',
  templateUrl: './basic-example.html',
  styleUrls: ['./basic-example.scss'],
  imports: [],
})
export class BasicExample {
  basicAlert() {
    Swal.fire({
      title: 'Welcome! to the Lagos theme',
      confirmButtonColor: 'var(--theme-default)',
    });
  }
}

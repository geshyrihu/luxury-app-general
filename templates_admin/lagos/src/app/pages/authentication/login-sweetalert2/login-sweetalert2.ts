import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CommanLoginForm } from '../comman-login-form/comman-login-form';

@Component({
  selector: 'app-login-sweetalert2',
  templateUrl: './login-sweetalert2.html',
  styleUrls: ['./login-sweetalert2.scss'],
  imports: [CommanLoginForm, RouterModule],
})
export class LoginSweetalert2 {}

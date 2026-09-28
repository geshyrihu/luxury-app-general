import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CommanLoginForm } from '../comman-login-form/comman-login-form';

@Component({
  selector: 'app-login-two-image',
  templateUrl: './login-two-image.html',
  styleUrls: ['./login-two-image.scss'],
  imports: [CommanLoginForm, RouterModule],
})
export class LoginTwoImage {}

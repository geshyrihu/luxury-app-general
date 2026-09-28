import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CommanLoginForm } from '../comman-login-form/comman-login-form';

@Component({
  selector: 'app-login-validation',
  templateUrl: './login-validation.html',
  styleUrls: ['./login-validation.scss'],
  imports: [CommanLoginForm, RouterModule],
})
export class LoginValidation {}

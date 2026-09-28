import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CommanLoginForm } from '../comman-login-form/comman-login-form';

@Component({
  selector: 'app-login-simple',
  templateUrl: './login-simple.html',
  styleUrls: ['./login-simple.scss'],
  imports: [CommanLoginForm, RouterModule],
})
export class LoginSimple {}

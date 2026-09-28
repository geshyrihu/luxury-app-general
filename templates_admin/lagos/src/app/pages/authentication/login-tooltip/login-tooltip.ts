import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CommanLoginForm } from '../comman-login-form/comman-login-form';

@Component({
  selector: 'app-login-tooltip',
  templateUrl: './login-tooltip.html',
  styleUrls: ['./login-tooltip.scss'],
  imports: [CommanLoginForm, RouterModule],
})
export class LoginTooltip {}

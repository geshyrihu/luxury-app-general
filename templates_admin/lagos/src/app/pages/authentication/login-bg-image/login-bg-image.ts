import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CommanLoginForm } from '../comman-login-form/comman-login-form';

@Component({
  selector: 'app-login-bg-image',
  templateUrl: './login-bg-image.html',
  styleUrls: ['./login-bg-image.scss'],
  imports: [RouterModule, CommanLoginForm],
})
export class LoginBgImage {}

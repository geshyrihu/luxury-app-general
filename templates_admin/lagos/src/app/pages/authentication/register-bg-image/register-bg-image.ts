import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CommonRegisterForm } from '../common-register-form/common-register-form';

@Component({
  selector: 'app-register-bg-image',
  templateUrl: './register-bg-image.html',
  styleUrls: ['./register-bg-image.scss'],
  imports: [CommonRegisterForm, RouterModule],
})
export class RegisterBgImage {}

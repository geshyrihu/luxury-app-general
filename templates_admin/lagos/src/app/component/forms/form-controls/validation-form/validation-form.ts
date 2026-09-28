import { Component } from '@angular/core';

import { BrowserDefaults } from './browser-defaults/browser-defaults';
import { FormValidations } from './form-validations/form-validations';
import { TooltipForm } from './tooltip-form/tooltip-form';

@Component({
  selector: 'app-validation-form',
  templateUrl: './validation-form.html',
  styleUrls: ['./validation-form.scss'],
  imports: [BrowserDefaults, FormValidations, TooltipForm],
})
export class ValidationForm {}

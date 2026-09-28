import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FeatherIcons } from '../../../shared/components/feather-icons/feather-icons';

@Component({
  selector: 'app-common-register-form',
  templateUrl: './common-register-form.html',
  styleUrls: ['./common-register-form.scss'],
  imports: [RouterModule, FeatherIcons],
})
export class CommonRegisterForm {
  public show: boolean = true;
}

import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FeatherIcons } from '../../../shared/components/feather-icons/feather-icons';

@Component({
  selector: 'app-comman-login-form',
  templateUrl: './comman-login-form.html',
  styleUrls: ['./comman-login-form.scss'],
  imports: [RouterModule, FeatherIcons],
})
export class CommanLoginForm {
  public show: boolean = true;
}

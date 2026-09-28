import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.html',
  styleUrls: ['./reset-password.scss'],
  imports: [RouterModule],
})
export class ResetPassword {
  public show: boolean = true;
}

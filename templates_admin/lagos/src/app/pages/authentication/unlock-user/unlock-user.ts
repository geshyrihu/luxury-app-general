import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-unlock-user',
  templateUrl: './unlock-user.html',
  styleUrls: ['./unlock-user.scss'],
  imports: [RouterModule],
})
export class UnlockUser {
  public show: boolean = true;
}

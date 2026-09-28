import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { FeatherIcons } from '../../feather-icons/feather-icons';

@Component({
  selector: 'app-profile',
  imports: [RouterModule, FeatherIcons],
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss'],
})
export class Profile {
  public isShow: boolean = false;
  public router = inject(Router);

  logOut() {
    localStorage.clear();
    this.router.navigateByUrl('/auth/login');
  }
}

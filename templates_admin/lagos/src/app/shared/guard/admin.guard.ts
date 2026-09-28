import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard {
  private router = inject(Router);

  canActivate(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot,
  ): Observable<boolean> | Promise<boolean> | boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!user || !Object.keys(user).length) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    return true;
  }
}

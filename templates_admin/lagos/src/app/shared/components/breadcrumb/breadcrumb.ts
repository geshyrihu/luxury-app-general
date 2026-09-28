import { Component, inject } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  PRIMARY_OUTLET,
  Router,
  RouterModule,
} from '@angular/router';

import { filter, map } from 'rxjs';

import { FeatherIcons } from '../feather-icons/feather-icons';

@Component({
  selector: 'app-breadcrumb',
  imports: [RouterModule, FeatherIcons],
  templateUrl: './breadcrumb.html',
  styleUrls: ['./breadcrumb.scss'],
})
export class Breadcrumb {
  public breadcrumbs: { parentBreadcrumb?: string; childBreadcrumb?: string; enable?: boolean };
  public title: string = '';
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  constructor() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .pipe(map(() => this.activatedRoute))
      .pipe(
        map(route => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
      )
      .pipe(filter(route => route.outlet === PRIMARY_OUTLET))
      .subscribe(route => {
        let title = route.snapshot.data['title'];
        let parent = route.parent?.snapshot.data['breadcrumb'];
        let isEnable = route.parent?.snapshot.data['isEnable'];
        let child = route.snapshot.data['breadcrumb'];
        this.breadcrumbs = {};
        this.title = title;
        this.breadcrumbs = {
          parentBreadcrumb: parent,
          childBreadcrumb: child,
          enable: isEnable,
        };
      });
  }
}

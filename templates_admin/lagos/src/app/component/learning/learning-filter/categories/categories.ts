import { Component } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { Categorie } from '../../../../shared/data/data/learning/learning';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.html',
  styleUrls: ['./categories.scss'],
  imports: [NgbModule],
})
export class Categories {
  public Categories = Categorie;

  public isCollapsed = false;
}

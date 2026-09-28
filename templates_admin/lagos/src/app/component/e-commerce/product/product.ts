import { Component, inject } from '@angular/core';

import { ProductFilter } from './product-filter/product-filter';
import { ProductShow } from './product-show/product-show';
import { FeatherIcons } from '../../../shared/components/feather-icons/feather-icons';
import { ProductService } from '../../../shared/services/product/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.html',
  styleUrls: ['./product.scss'],
  imports: [FeatherIcons, ProductFilter, ProductShow],
})
export class Products {
  public listView: boolean = false;
  public openSidebar: boolean = false;
  public isShow: Boolean = false;
  public productServices = inject(ProductService);

  gridOpens() {
    this.listView = false;
    this.productServices.gridOpen();
  }

  listOpens() {
    this.listView = true;
    this.productServices.listOpen();
  }

  grid2s() {
    this.listView = false;
    this.productServices.grid2();
  }

  grid3s() {
    this.listView = false;
    this.productServices.grid3();
  }

  grid6s() {
    this.listView = false;
    this.productServices.grid6();
  }

  sidebarToggle() {
    this.openSidebar = !this.openSidebar;
  }
}

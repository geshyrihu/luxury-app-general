import { Component, inject, TemplateRef, viewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import * as data from '../../../../shared/model/product.model';

@Component({
  selector: 'app-quick-view',
  templateUrl: './quick-view.html',
  styleUrls: ['./quick-view.scss'],
  imports: [RouterModule],
})
export class QuickView {
  public productDetail: data.Products;
  public counter: number = 1;
  public closeResult: string;
  public modalOpen: boolean = false;
  private router = inject(Router);
  private modalService = inject(NgbModal);

  readonly productModal = viewChild<TemplateRef<data.Products>>('productModal');

  constructor() {}

  async openModal(product: data.Products) {
    this.productDetail = product;
    this.modalOpen = true;
    this.modalService
      .open(this.productModal(), {
        ariaLabelledBy: 'Confirmation-Modal',
        centered: true,
        windowClass: 'modal-lg modal-dialog-centered',
      })
      .result.then(
        result => {
          `Result ${result}`;
        },
        reason => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        },
      );
  }

  private getDismissReason(reason: ModalDismissReasons): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  public increment() {
    this.counter += 1;
  }

  public decrement() {
    if (this.counter > 1) {
      this.counter -= 1;
    }
  }
}

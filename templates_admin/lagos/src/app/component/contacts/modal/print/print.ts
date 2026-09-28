import { Component, inject, TemplateRef, viewChild } from '@angular/core';

import { ModalDismissReasons, NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxPrintModule } from 'ngx-print';

import * as data from '../../../../shared/data/data/contacts/contacts';

@Component({
  selector: 'app-print',
  templateUrl: './print.html',
  styleUrls: ['./print.scss'],
  imports: [NgxPrintModule],
  providers: [NgbActiveModal],
})
export class Print {
  public closeResult: string;
  public modalOpen: boolean = false;
  public printData: data.dataList;

  readonly printModal = viewChild<TemplateRef<data.dataList>>('printModal');

  public activeModal = inject(NgbActiveModal);
  private modalService = inject(NgbModal);

  async openModal(data: data.dataList) {
    this.printData = data;
    this.modalOpen = true;
    this.modalService
      .open(this.printModal(), {
        ariaLabelledBy: 'Confirmation-Modal',
        centered: true,
        windowClass: 'modal-md modal-dialog-centered',
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
}

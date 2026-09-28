import { Component, inject, TemplateRef, viewChild } from '@angular/core';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import * as data from '../../../../shared/data/data/bookmarks/bookmark';

@Component({
  selector: 'app-edit-bookmark',
  templateUrl: './edit-bookmark.html',
  styleUrls: ['./edit-bookmark.scss'],
  imports: [],
})
export class EditBookmark {
  public closeResult: string;
  public modalOpen: boolean = false;
  public bookmarkDetails: data.bookmarkModel[];

  readonly editBookmarkModal = viewChild<TemplateRef<data.bookMark>>('editBookmarkModal');
  public modalService = inject(NgbModal);

  async openModal(data: data.bookmarkModel[]) {
    this.bookmarkDetails = data;
    this.modalOpen = true;
    this.modalService
      .open(this.editBookmarkModal(), {
        ariaLabelledBy: 'EditBookmark-Modal',
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
}

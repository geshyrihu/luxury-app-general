import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Editor, NgxEditorModule } from 'ngx-editor';

@Component({
  selector: 'app-compose-email',
  templateUrl: './compose-email.html',
  styleUrls: ['./compose-email.scss'],
  imports: [NgbModule, NgxEditorModule, FormsModule],
})
export class ComposeEmail {
  public isCc: boolean = false;
  public isBcc: boolean = false;
  public editor: Editor;
  public html = '';

  private modal = inject(NgbModal);

  ngOnInit(): void {
    this.editor = new Editor();
  }

  close() {
    this.modal.dismissAll();
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }
}

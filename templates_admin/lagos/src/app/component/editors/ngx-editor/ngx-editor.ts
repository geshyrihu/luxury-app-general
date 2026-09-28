import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Editor, NgxEditorModule } from 'ngx-editor';

@Component({
  selector: 'app-ngx-editor',
  templateUrl: './ngx-editor.html',
  styleUrl: './ngx-editor.scss',
  imports: [NgxEditorModule, FormsModule],
})
export class NgxEditor {
  public editor: Editor;
  public html = '';

  ngOnInit(): void {
    this.editor = new Editor();
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }
}

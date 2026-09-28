import { NgClass } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Editor, NgxEditorModule } from 'ngx-editor';

import { CommonSvgIcon } from '../../../../shared/components/common-svg-icon/common-svg-icon';
import { FeatherIcons } from '../../../../shared/components/feather-icons/feather-icons';

@Component({
  selector: 'app-interview-mail',
  templateUrl: './interview-mail.html',
  styleUrls: ['./interview-mail.scss'],
  imports: [CommonSvgIcon, NgxEditorModule, FormsModule, FeatherIcons, NgClass],
})
export class InterviewMail {
  public isBookmark: boolean = false;
  public isReply: boolean = false;

  readonly open = input.required<boolean>();
  readonly childEvent = output<boolean>();

  public editor: Editor;
  public html = '';

  ngOnInit(): void {
    this.editor = new Editor();
  }

  clickValue(value: boolean) {
    value = false;
    this.childEvent.emit(value);
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }
}

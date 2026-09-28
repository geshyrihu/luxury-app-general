import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AngularEditorModule } from '@kolkov/angular-editor';

import { CommonSvgIcon } from '../../../../../shared/components/common-svg-icon/common-svg-icon';

@Component({
  selector: 'app-additional-options',
  templateUrl: './additional-options.html',
  styleUrls: ['./additional-options.scss'],
  imports: [FormsModule, CommonSvgIcon, AngularEditorModule],
})
export class AdditionalOptions {
  public htmlContent = '';
  public items = [];
}

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AngularEditorModule } from '@kolkov/angular-editor';

@Component({
  selector: 'app-mde-editors',
  templateUrl: './mde-editors.html',
  styleUrls: ['./mde-editors.scss'],
  imports: [AngularEditorModule, FormsModule],
})
export class MdeEditors {
  public htmlContent = '';
}

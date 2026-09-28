import { Component } from '@angular/core';

import * as data from '../../../../../shared/data/data/forms/chechbox-radio';

@Component({
  selector: 'app-images-with-checkbox',
  templateUrl: './images-with-checkbox.html',
  styleUrls: ['./images-with-checkbox.scss'],
  imports: [],
})
export class ImagesWithCheckbox {
  public imagesWithCheckbox = data.imagesWithCheckbox;
}

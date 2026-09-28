import { Component } from '@angular/core';

import * as data from '../../../../../shared/data/data/forms/chechbox-radio';

@Component({
  selector: 'app-images-with-radio',
  templateUrl: './images-with-radio.html',
  styleUrls: ['./images-with-radio.scss'],
  imports: [],
})
export class ImagesWithRadio {
  public imagesWithRadio = data.imagesWithRadio;
}

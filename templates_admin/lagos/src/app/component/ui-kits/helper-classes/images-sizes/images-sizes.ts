import { Component } from '@angular/core';

import * as data from '../../../../shared/data/data/ui-kits/helper-class';

@Component({
  selector: 'app-images-sizes',
  templateUrl: './images-sizes.html',
  styleUrls: ['./images-sizes.scss'],
  imports: [],
})
export class ImagesSizes {
  public imageSizeData = data.imageSizeData;
}

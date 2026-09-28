import { Component } from '@angular/core';

import { radio } from '../../../../shared/data/data/ui-kits/list';

@Component({
  selector: 'app-radios',
  templateUrl: './radios.html',
  styleUrls: ['./radios.scss'],
  imports: [],
})
export class Radios {
  public radio = radio;
}

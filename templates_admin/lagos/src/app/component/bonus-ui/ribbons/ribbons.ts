import { Component } from '@angular/core';

import { LeftRibbons } from './left-ribbons/left-ribbons';
import { RightRibbons } from './right-ribbons/right-ribbons';

@Component({
  selector: 'app-ribbons',
  templateUrl: './ribbons.html',
  styleUrls: ['./ribbons.scss'],
  imports: [LeftRibbons, RightRibbons],
})
export class Ribbons {}

import { Component } from '@angular/core';

import { ButtonsWithPrefix } from './buttons-with-prefix/buttons-with-prefix';
import { CommonTouchspin } from './common-touchspin/common-touchspin';
import { IconsWithPrefix } from './icons-with-prefix/icons-with-prefix';
import { RoundedTouchspin } from './rounded-touchspin/rounded-touchspin';

@Component({
  selector: 'app-touchspin',
  templateUrl: './touchspin.html',
  styleUrls: ['./touchspin.scss'],
  imports: [CommonTouchspin, IconsWithPrefix, ButtonsWithPrefix, RoundedTouchspin],
})
export class Touchspin {}

import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import * as data from '../../../../../shared/data/data/forms/chechbox-radio';

@Component({
  selector: 'app-animated-buttons',
  templateUrl: './animated-buttons.html',
  styleUrls: ['./animated-buttons.scss'],
  imports: [FormsModule, NgClass],
})
export class AnimatedButtons {
  public animatedButtons = data.animatedButtons;
}

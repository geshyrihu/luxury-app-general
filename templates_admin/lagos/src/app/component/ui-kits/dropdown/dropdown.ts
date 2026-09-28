import { Component } from '@angular/core';

import { Alignments } from './alignments/alignments';
import { Basic } from './basic/basic';
import { Dark } from './dark/dark';
import { Divider } from './divider/divider';
import { DropdownSizing } from './dropdown-sizing/dropdown-sizing';
import { Heading } from './heading/heading';
import { HelperCard } from './helper-card/helper-card';
import { InputType } from './input-type/input-type';
import { JustifyContents } from './justify-contents/justify-contents';
import { Rounded } from './rounded/rounded';
import { SplitDropdown } from './split-dropdown/split-dropdown';
import { Unique } from './unique/unique';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.html',
  styleUrls: ['./dropdown.scss'],
  imports: [
    Unique,
    SplitDropdown,
    Rounded,
    JustifyContents,
    InputType,
    HelperCard,
    Heading,
    DropdownSizing,
    Divider,
    Dark,
    Basic,
    Alignments,
  ],
})
export class Dropdown {}

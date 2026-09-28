import { Component } from '@angular/core';

import { BasicPopover } from './basic-popover/basic-popover';
import { PopoverDirection } from './popover-direction/popover-direction';
import { PopoverOffset } from './popover-offset/popover-offset';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.html',
  styleUrls: ['./popover.scss'],
  imports: [BasicPopover, PopoverDirection, PopoverOffset],
})
export class Popover {}

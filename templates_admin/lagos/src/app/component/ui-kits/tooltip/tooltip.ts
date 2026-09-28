import { Component } from '@angular/core';

import { BasicTooltip } from './basic-tooltip/basic-tooltip';
import { ColoredTooltip } from './colored-tooltip/colored-tooltip';
import { FilledTooltip } from './filled-tooltip/filled-tooltip';
import { HoverEffect } from './hover-effect/hover-effect';
import { TooltipDirections } from './tooltip-directions/tooltip-directions';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.html',
  styleUrls: ['./tooltip.scss'],
  imports: [BasicTooltip, ColoredTooltip, FilledTooltip, HoverEffect, TooltipDirections],
})
export class Tooltip {}

import { Component } from '@angular/core';

import { GridForColumn } from './grid-for-column/grid-for-column';
import { GridOptions } from './grid-options/grid-options';
import { HorizontalAlignment } from './horizontal-alignment/horizontal-alignment';
import { Nesting } from './nesting/nesting';
import { Offset } from './offset/offset';
import { Order } from './order/order';
import { VerticalAlignment } from './vertical-alignment/vertical-alignment';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.html',
  styleUrls: ['./grid.scss'],
  imports: [
    GridForColumn,
    GridOptions,
    HorizontalAlignment,
    Nesting,
    Offset,
    Order,
    VerticalAlignment,
  ],
})
export class Grid {}

import { Component } from '@angular/core';

import { BasicTableWithBorderBottomColor } from './basic-table-with-border-bottom-color/basic-table-with-border-bottom-color';
import { BreckpointSpecific } from './breckpoint-specific/breckpoint-specific';
import { Caption } from './caption/caption';
import { CustomTableColorStripped } from './custom-table-color-stripped/custom-table-color-stripped';
import { DashedBorder } from './dashed-border/dashed-border';
import { HoverableRowsBorder } from './hoverable-rows-border/hoverable-rows-border';
import { InverseTable } from './inverse-table/inverse-table';
import { InverseTablePrimaryBack } from './inverse-table-primary-back/inverse-table-primary-back';
import { ResponsiveTablesBackground } from './responsive-tables-background/responsive-tables-background';
import { SizingTables } from './sizing-tables/sizing-tables';
import { StripedRowTable } from './striped-row-table/striped-row-table';
import { TableHeadOptions } from './table-head-options/table-head-options';

@Component({
  selector: 'app-basic-table',
  templateUrl: './basic-table.html',
  styleUrls: ['./basic-table.scss'],
  imports: [
    BasicTableWithBorderBottomColor,
    BreckpointSpecific,
    Caption,
    CustomTableColorStripped,
    DashedBorder,
    HoverableRowsBorder,
    InverseTablePrimaryBack,
    ResponsiveTablesBackground,
    SizingTables,
    SizingTables,
    StripedRowTable,
    TableHeadOptions,
    InverseTable,
  ],
})
export class BasicTable {}

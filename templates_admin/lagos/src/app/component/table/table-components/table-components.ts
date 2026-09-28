import { Component } from '@angular/core';

import { Alerts } from './alerts/alerts';
import { Badges } from './badges/badges';
import { Checkbox } from './checkbox/checkbox';
import { Input } from './input/input';
import { Progressbar } from './progressbar/progressbar';
import { RadioButtons } from './radio-buttons/radio-buttons';
import { Select } from './select/select';
import { Switch } from './switch/switch';
import { TooltipTriggers } from './tooltip-triggers/tooltip-triggers';
import { UIComponents } from './ui-components/ui-components';

@Component({
  selector: 'app-table-components',
  templateUrl: './table-components.html',
  styleUrls: ['./table-components.scss'],
  imports: [
    Alerts,
    Badges,
    Checkbox,
    Input,
    Progressbar,
    RadioButtons,
    Select,
    Switch,
    TooltipTriggers,
    UIComponents,
  ],
})
export class TableComponents {}

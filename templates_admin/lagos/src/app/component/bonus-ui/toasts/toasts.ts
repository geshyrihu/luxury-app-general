import { Component } from '@angular/core';

import { ColorsSchemes } from './colors-schemes/colors-schemes';
import { DefaultToast } from './default-toast/default-toast';
import { LiveToast } from './live-toast/live-toast';
import { StackingToasts } from './stacking-toasts/stacking-toasts';
import { TranslucentToasts } from './translucent-toasts/translucent-toasts';
import { UniqueToast } from './unique-toast/unique-toast';

@Component({
  selector: 'app-toasts',
  templateUrl: './toasts.html',
  styleUrls: ['./toasts.scss'],
  imports: [ColorsSchemes, DefaultToast, LiveToast, StackingToasts, TranslucentToasts, UniqueToast],
})
export class Toasts {}

import { TitleCasePipe } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-full-color-variant',
  templateUrl: './full-color-variant.html',
  styleUrls: ['./full-color-variant.scss'],
  imports: [TitleCasePipe],
})
export class FullColorVariant {
  public colors = ['primary', 'secondary', 'success', 'info', 'warning', 'danger', 'inverse'];
}

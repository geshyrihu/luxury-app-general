import { TitleCasePipe } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-color-variant',
  templateUrl: './color-variant.html',
  styleUrls: ['./color-variant.scss'],
  imports: [TitleCasePipe],
})
export class ColorVariant {
  public colors = ['primary', 'secondary', 'success', 'info', 'warning', 'danger', 'inverse'];
}

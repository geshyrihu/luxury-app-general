import { NgClass } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-colors-schemes',
  templateUrl: './colors-schemes.html',
  styleUrls: ['./colors-schemes.scss'],
  imports: [NgClass],
})
export class ColorsSchemes {
  public isShow: boolean = false;
}

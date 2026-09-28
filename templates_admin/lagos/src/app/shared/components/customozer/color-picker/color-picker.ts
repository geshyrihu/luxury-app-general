import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { LayoutService } from '../../../services/layout.service';

@Component({
  selector: 'app-color-picker',
  imports: [FormsModule],
  templateUrl: './color-picker.html',
  styleUrls: ['./color-picker.scss'],
})
export class ColorPicker {
  public primary_color: string = localStorage.getItem('primary_color') || '#6f5a99';
  public secondary_color: string = localStorage.getItem('secondary_color') || '#e24175';
  public maxLayout: string = 'dark-sidebar';
  private layout = inject(LayoutService);

  constructor() {
    document.documentElement.style.setProperty(
      '--theme-default',
      localStorage.getItem('primary_color'),
    );
    document.documentElement.style.setProperty(
      '--theme-secondary',
      localStorage.getItem('secondary_color'),
    );
    var primary = localStorage.getItem('primary_color') || this.layout.config.color.primary_color;
    var secondary =
      localStorage.getItem('secondary_color') || this.layout.config.color.secondary_color;
    this.layout.config.color.primary_color = primary;
    this.layout.config.color.secondary_color = secondary;
    localStorage.getItem('primary_color') || this.layout.config.color.primary_color;
    localStorage.getItem('secondary_color') || this.layout.config.color.secondary_color;
  }

  applyColor() {
    this.layout.config.color.secondary_color = this.primary_color;
    this.layout.config.color.secondary_color = this.secondary_color;
    localStorage.setItem('primary_color', this.primary_color);
    localStorage.setItem('secondary_color', this.secondary_color);
    window.location.reload();
  }

  resetColor() {
    document.documentElement.style.setProperty('--theme-default', '#6f5a99');
    document.documentElement.style.setProperty('--theme-secondary', '#e24175');
    (<HTMLInputElement>document.getElementById('ColorPicker1')).value = '#6f5a99';
    (<HTMLInputElement>document.getElementById('ColorPicker2')).value = '#e24175';
    localStorage.setItem('primary_color', '#6f5a99');
    localStorage.setItem('secondary_color', '#e24175');
    window.location.reload();
  }

  customizeMixLayout(value: string) {
    this.maxLayout = value;
    this.layout.config.settings.layout_version = value;
    document.body.classList.remove('dark-sidebar', 'dark-only');
    if (value == 'dark-sidebar') {
      document.body?.classList.add('dark-sidebar');
    } else {
      document.body?.classList.add('dark-only');
    }
  }
}

import { NgClass } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-default-toast',
  templateUrl: './default-toast.html',
  styleUrls: ['./default-toast.scss'],
  imports: [NgClass],
})
export class DefaultToast {
  public isShow: boolean = true;

  close() {
    this.isShow = false;
  }
}

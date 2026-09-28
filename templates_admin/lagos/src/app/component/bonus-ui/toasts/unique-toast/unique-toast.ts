import { NgClass } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-unique-toast',
  templateUrl: './unique-toast.html',
  styleUrls: ['./unique-toast.scss'],
  imports: [NgClass],
})
export class UniqueToast {
  public isShow: boolean = true;

  close() {
    this.isShow = false;
  }
}

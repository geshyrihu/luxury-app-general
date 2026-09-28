import { Component } from '@angular/core';

@Component({
  selector: 'app-live-toast',
  templateUrl: './live-toast.html',
  styleUrls: ['./live-toast.scss'],
  imports: [],
})
export class LiveToast {
  public topRightShow: boolean = false;
  public bottomRightShow: boolean = false;
  public topLeftShow: boolean = false;
  public bottomLeftShow: boolean = false;

  topRight() {
    this.topRightShow = true;
    setTimeout(() => {
      this.topRightShow = false;
    }, 2000);
  }

  topRightClose() {
    this.topRightShow = false;
  }

  bottomRight() {
    this.bottomRightShow = true;
    setTimeout(() => {
      this.bottomRightShow = false;
    }, 2000);
  }

  topBottomClose() {
    this.bottomRightShow = false;
  }

  topLeft() {
    this.topLeftShow = true;
    setTimeout(() => {
      this.topLeftShow = false;
    }, 2000);
  }

  topLeftClose() {
    this.topLeftShow = false;
  }

  bottomLeft() {
    this.bottomLeftShow = true;
    setTimeout(() => {
      this.bottomLeftShow = false;
    }, 2000);
  }

  bottomLeftClose() {
    this.bottomLeftShow = false;
  }
}

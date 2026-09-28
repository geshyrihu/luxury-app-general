import { Component } from '@angular/core';

@Component({
  selector: 'app-coming-soon-simple',
  templateUrl: './coming-soon-simple.html',
  styleUrls: ['./coming-soon-simple.scss'],
  imports: [],
})
export class ComingSoonSimple {
  public seconds: number;
  public interval: ReturnType<typeof setInterval>;

  constructor() {
    this.interval = setInterval(
      function (this: ComingSoonSimple) {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        currentDate.setDate(currentDate.getDate() + 7);

        const nowDate = new Date();
        const distance = currentDate.getTime() - nowDate.getTime();

        document.querySelectorAll('#day').forEach(element => {
          (element as HTMLElement).innerHTML = Math.floor(
            distance / (1000 * 60 * 60 * 24),
          ).toString();
        });

        document.querySelectorAll('#hour').forEach(element => {
          (element as HTMLElement).innerHTML = Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
          ).toString();
        });

        document.querySelectorAll('#minute').forEach(element => {
          (element as HTMLElement).innerHTML = Math.floor(
            (distance % (1000 * 60 * 60)) / (1000 * 60),
          ).toString();
        });

        document.querySelectorAll('#second').forEach(element => {
          (element as HTMLElement).innerHTML = Math.floor(
            (distance % (1000 * 60)) / 1000,
          ).toString();
        });
      }.bind(this),
      this.seconds,
    );
  }

  ngOnDestroy(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}

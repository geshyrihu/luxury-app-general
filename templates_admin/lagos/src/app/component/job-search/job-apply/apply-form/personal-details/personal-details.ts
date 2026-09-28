import { Component } from '@angular/core';

@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.html',
  styleUrls: ['./personal-details.scss'],
  imports: [],
})
export class PersonalDetails {
  public date = new Array();
  public year = new Array();

  constructor() {
    for (let i = 1; i <= 31; i++) {
      this.date.push(i);
    }

    for (let i = 1985; i <= 2019; i++) {
      this.year.push(i);
    }
  }
}

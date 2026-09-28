import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbDateStruct, NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-calendar-dashboard',
  templateUrl: './calendar-dashboard.html',
  styleUrls: ['./calendar-dashboard.scss'],
  imports: [NgbModule, FormsModule, ReactiveFormsModule],
})
export class CalendarDashboard {
  public model: NgbDateStruct;
  public date: { year: number; month: number };
}

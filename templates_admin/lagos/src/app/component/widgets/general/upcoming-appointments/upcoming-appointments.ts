import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import * as data from '../../../../shared/data/data/dashboard/dashboard';
import { CalendarDashboard } from '../calendar-dashboard/calendar-dashboard';

@Component({
  selector: 'app-upcoming-appointments',
  templateUrl: './upcoming-appointments.html',
  styleUrls: ['./upcoming-appointments.scss'],
  imports: [CalendarDashboard, RouterModule],
})
export class UpcomingAppointments {
  public upcomingAppointments = data.upcomingAppointments;
}

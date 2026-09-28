import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { appointmentTable } from '../../../../shared/data/data/dashboard/dashboard';
import { ClickOutsideDirective } from '../../../../shared/directive/click-outside.directive';

@Component({
  selector: 'app-overall-appointment',
  templateUrl: './overall-appointment.html',
  styleUrl: './overall-appointment.scss',
  imports: [ClickOutsideDirective, RouterModule],
})
export class OverallAppointment {
  public isShow: boolean = false;
  public appointmentTable = appointmentTable;

  outSide() {
    this.isShow = false;
  }
}

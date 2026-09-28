import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { FeatherIcons } from '../../shared/components/feather-icons/feather-icons';
import * as data from '../../shared/data/data/todo/todo';
import { Task } from '../../shared/data/data/todo/todo';
import { ClickOutsideDirective } from '../../shared/directive/click-outside.directive';

@Component({
  selector: 'app-to-do',
  templateUrl: './to-do.html',
  styleUrls: ['./to-do.scss'],
  imports: [FeatherIcons, FormsModule, NgbModule, ClickOutsideDirective],
  providers: [DatePipe],
})
export class ToDo {
  public textData: string = '';
  public completed: boolean = false;
  public todoList = data.task;
  public isShow: boolean = false;
  public isOpen: boolean = false;

  private toaster = inject(ToastrService);
  private datePipe = inject(DatePipe);

  constructor() {}

  addTask() {
    let myDate = new Date();
    let formattedDate = this.datePipe.transform(myDate, 'dd MMM');
    if (this.textData && formattedDate) {
      let someData = {
        text: this.textData,
        Date: formattedDate,
        priority: 'Pending',
        badgeClass: 'badge-light-danger',
        completed: false,
      };
      this.todoList.unshift(someData);
      this.toaster.success(this.textData, 'added to list');
    }
  }

  taskDeleted(index: number, data: Task) {
    this.todoList.splice(index, 1);
    data.completed = !data.completed;
    if (data.completed) {
      this.toaster.success(data.text, 'marked as complete.');
    } else {
      this.toaster.success(data.text, 'marked as In complete.');
    }
  }

  taskComplete(data: Task) {
    data.completed = !data.completed;
    if (data.completed) {
      this.toaster.success(data.text, 'marked as complete.');
    } else {
      this.toaster.success(data.text, 'marked as Incomplete.');
    }
  }

  outSide() {
    this.isOpen = false;
  }
}

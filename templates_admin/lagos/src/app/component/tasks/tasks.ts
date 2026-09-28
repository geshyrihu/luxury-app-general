import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { CreateTag } from './modal/create-tag/create-tag';
import { NewTask } from './modal/new-task/new-task';
import { TasksData } from './tasks-data/tasks-data';
import { FeatherIcons } from '../../shared/components/feather-icons/feather-icons';
import * as data from '../../shared/data/data/tasks/tasks';
import { ClickOutsideDirective } from '../../shared/directive/click-outside.directive';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.html',
  styleUrls: ['./tasks.scss'],
  imports: [ClickOutsideDirective, FeatherIcons, TasksData, NgClass],
})
export class Tasks {
  public selectedId: number;
  public tasks = data.tasks;
  public view = data.view;
  public statusData: boolean;
  public isOpen: boolean = false;

  private modalService = inject(NgbModal);

  ngOnInit() {
    let trueData = this.tasks.filter(x => x.status == true);
    this.statusData = trueData[0]?.status;
  }

  changeData(list: data.tasks) {
    const getId = this.view.filter(x => x.title_id == list.title_id);
    this.selectedId = getId[0].title_id;
  }

  changeData1(list: number) {
    const getId = this.tasks.filter(x => x.title_id == list);
    this.selectedId = getId[0].title_id;
  }

  newTasks() {
    this.modalService.open(NewTask, {
      size: 'lg',
    });
  }

  creatTasks() {
    this.modalService.open(CreateTag, {
      size: 'lg',
    });
  }

  outSide() {
    this.isOpen = false;
  }
}

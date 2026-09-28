import { Component, SimpleChanges, input } from '@angular/core';

import { FeatherIcons } from '../../../shared/components/feather-icons/feather-icons';
import * as data from '../../../shared/data/data/tasks/tasks';

@Component({
  selector: 'app-tasks-data',
  templateUrl: './tasks-data.html',
  styleUrls: ['./tasks-data.scss'],
  imports: [FeatherIcons],
})
export class TasksData {
  public tasks = data.tasks;
  public view = data.view;
  public getTaskData: data.tasks;
  readonly selectedId = input<number>();
  readonly status = input<boolean>();

  ngOnInit() {
    this.view.map(data => {
      if (data.status) {
        this.getTaskData = data;
      }
    });
    this.tasks.map(data => {
      if (data.status) {
        this.getTaskData = data;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    let id = changes['selectedId']?.currentValue;
    this.view.map(data => {
      if (data.title_id === id) {
        this.getTaskData = data;
      }
    });

    let tagsid = changes['selectedId']?.currentValue;
    this.tasks.map(data => {
      if (data.title_id === tagsid) {
        this.getTaskData = data;
      }
    });
  }
}

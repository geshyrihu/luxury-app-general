import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FeatherIcons } from '../../../shared/components/feather-icons/feather-icons';
import * as data from '../../../shared/data/data/project/project';
import { project } from '../../../shared/data/data/project/project';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.html',
  styleUrls: ['./project-list.scss'],
  imports: [FeatherIcons, RouterModule, NgClass],
})
export class ProjectList {
  public active: number = 1;
  public openTab: string = 'All';
  public ProjectLists = data.ProjectList;
  public filterData: project[] = this.ProjectLists;

  public tabbed(val: string) {
    this.openTab = val;
    this.filterData =
      val !== 'All'
        ? this.ProjectLists.filter((data: project) => {
            return data.badge == this.openTab ? true : false;
          })
        : this.ProjectLists;
  }
}

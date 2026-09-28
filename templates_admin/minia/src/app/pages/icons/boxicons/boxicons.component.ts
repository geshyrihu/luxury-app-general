import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-boxicons',
    templateUrl: './boxicons.component.html',
    styleUrls: ['./boxicons.component.scss'],
    standalone: false
})

/**
 * Box Icons Component
 */
export class BoxiconsComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  constructor() { }

  ngOnInit(): void {
    /**
     * BreadCrumb Set
     */
    this.breadCrumbItems = [
      { label: 'Icons' },
      { label: 'Boxicons', active: true }
    ];
  }

}

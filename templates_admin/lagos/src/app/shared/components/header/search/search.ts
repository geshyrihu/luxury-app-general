import { SlicePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ClickOutsideDirective } from '../../../directive/click-outside.directive';
import { SearchService } from '../../../services/search.service';
import { CommonSvgIcon } from '../../common-svg-icon/common-svg-icon';
import { SvgIcon } from '../../svg-icon/svg-icon';

@Component({
  selector: 'app-search',
  imports: [
    CommonSvgIcon,
    SvgIcon,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ClickOutsideDirective,
    SlicePipe,
  ],
  templateUrl: './search.html',
  styleUrls: ['./search.scss'],
})
export class Search {
  public searchService = inject(SearchService);
}

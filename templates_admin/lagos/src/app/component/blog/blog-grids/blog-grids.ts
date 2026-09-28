import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CommonSvgIcon } from '../../../shared/components/common-svg-icon/common-svg-icon';
import { blogGrid, blogGrids, latestNewsAndTrends } from '../../../shared/data/data/blog/blog';
import { BlogFilter } from '../widgets/blog-filter/blog-filter';

@Component({
  selector: 'app-blog-grids',
  templateUrl: './blog-grids.html',
  styleUrl: './blog-grids.scss',
  imports: [CommonSvgIcon, BlogFilter, RouterModule],
})
export class BlogGrids {
  public blogGrids = blogGrids;
  public latestNewsAndTrends = latestNewsAndTrends;

  liked(value: blogGrid) {
    return (value.like = !value.like);
  }
}

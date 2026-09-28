import { Component } from '@angular/core';

import { popularTags, recentPosts, trendingPosts } from '../../../../shared/data/data/blog/blog';
import { ClickOutsideDirective } from '../../../../shared/directive/click-outside.directive';

@Component({
  selector: 'app-blog-filter',
  templateUrl: './blog-filter.component.html',
  styleUrl: './blog-filter.component.scss',
  imports: [ClickOutsideDirective],
})
export class BlogFilter {
  public isOpen: boolean = false;
  public trendingPosts = trendingPosts;
  public recentPosts = recentPosts;
  public popularTags = popularTags;

  outSide() {
    this.isOpen = false;
  }
}

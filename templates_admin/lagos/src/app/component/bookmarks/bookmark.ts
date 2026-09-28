import { Component, inject } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { BookmarkData } from './bookmark-data/bookmark-data';
import { CreateTag } from './modal/create-tag/create-tag';
import { NewBookmarks } from './modal/new-bookmarks/new-bookmarks';
import { FeatherIcons } from '../../shared/components/feather-icons/feather-icons';
import * as data from '../../shared/data/data/bookmarks/bookmark';
import { ClickOutsideDirective } from '../../shared/directive/click-outside.directive';

@Component({
  selector: 'app-bookmark',
  templateUrl: './bookmark.html',
  styleUrls: ['./bookmark.scss'],
  imports: [FeatherIcons, BookmarkData, ClickOutsideDirective],
})
export class Bookmark {
  public ViewsData = data.ViewsData;
  public tagsData = data.tagsData;
  public selected_id: number;
  public isOpen: boolean = false;
  public statusActive: boolean;

  private modalService = inject(NgbModal);

  newBookMark() {
    this.modalService.open(NewBookmarks, {
      size: 'lg',
    });
  }

  createTag() {
    this.modalService.open(CreateTag, {
      size: 'lg',
    });
  }

  changeDataView(id: number) {
    const viewId = this.ViewsData.filter(x => x.title_id == id);
    this.selected_id = viewId[0].title_id;
  }

  changeDataTags(id: number) {
    const tagId = this.tagsData.filter(x => x.title_id == id);
    this.selected_id = tagId[0].title_id;
  }

  outSide() {
    this.isOpen = false;
  }
}

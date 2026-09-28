import { Component, SimpleChanges, input, viewChild } from '@angular/core';

import { FeatherIcons } from '../../../shared/components/feather-icons/feather-icons';
import * as data from '../../../shared/data/data/bookmarks/bookmark';
import { bookmarkModel } from '../../../shared/data/data/bookmarks/bookmark';
import { EditBookmark } from '../modal/edit-bookmark/edit-bookmark';

@Component({
  selector: 'app-bookmark-data',
  templateUrl: './bookmark-data.html',
  styleUrls: ['./bookmark-data.scss'],
  imports: [FeatherIcons, EditBookmark],
})
export class BookmarkData {
  readonly selectedId = input<number>();
  public getBookmarkData: data.bookMark;
  public ViewsData = data.ViewsData;
  public tagsData = data.tagsData;
  public bookMark: data.bookmarkModel[];
  public editBookmarkData: data.bookmarkModel[];
  public listGrid: boolean = false;
  public bookmarkData: data.bookmarkModel[] = [];

  readonly editBookMark = viewChild<EditBookmark>('editBookmarkModal');

  ngOnInit() {
    this.ViewsData.map(data => {
      if (data.active) {
        this.getBookmarkData = data;
        for (let i of data.data) {
          this.bookmarkData.push(i);
        }
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    let ids = changes['selectedId']?.currentValue;
    this.ViewsData.map(data => {
      if (data.title_id == ids) {
        this.getBookmarkData = data;
      }
    });
    let id = changes['selectedId']?.currentValue;
    this.tagsData.map(data => {
      if (data.title_id == id) {
        this.getBookmarkData = data;
      }
    });
  }

  changeGrid() {
    this.listGrid = false;
  }

  changeList() {
    this.listGrid = true;
  }

  bookMarkItem(item: bookmarkModel) {
    return (item.favorite = !item.favorite);
  }

  editBookmarkModel(id: number) {
    const modelData = this.bookmarkData.filter(data => {
      return data.id === id;
    });
    this.editBookmarkData = modelData;
    this.editBookMark()?.openModal(this.editBookmarkData);
  }
}

import { SlicePipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { Menu, NavService } from '../../../services/nav.service';
import { CommonSvgIcon } from '../../common-svg-icon/common-svg-icon';
import { SvgIcon } from '../../svg-icon/svg-icon';

@Component({
  selector: 'app-bookmark',
  imports: [RouterModule, FormsModule, SvgIcon, CommonSvgIcon, SlicePipe],
  templateUrl: './bookmark.html',
  styleUrls: ['./bookmark.scss'],
})
export class Bookmark {
  public isFlip: boolean = false;
  readonly item = input<boolean>();
  public menuItems: Menu[] = [];
  public items: Menu[] = [];
  public bookmarkItems: Menu[] = [];
  public text: string = '';
  public bookmarkFlip = false;
  public bookmark = false;
  public open = false;
  public searchResult = false;
  public searchResultEmpty = false;
  public navServices = inject(NavService);

  ngOnInit(): void {
    this.navServices.items.subscribe(menuItems => {
      this.items = menuItems;
      this.items.filter(items => {
        if (items.bookmark) {
          this.bookmarkItems.push(items);
        }
        if (!items.children) return false;
        items.children.filter(subItems => {
          if (subItems.bookmark) {
            this.bookmarkItems.push(subItems);
          }
        });
        return;
      });
    });
  }

  searchTerm(term: string) {
    term ? this.addFix() : this.removeFix();
    if (!term) {
      this.open = false;
      return (this.menuItems = []);
    }
    const items: Menu[] = [];
    term = term.toLowerCase();
    this.items.filter((menuItems: Menu) => {
      if (!menuItems?.title) return false;
      if (menuItems.title.toLowerCase().includes(term) && menuItems.type === 'link') {
        items.push(menuItems);
      }
      if (!menuItems.children) {
        return false;
      }
      menuItems.children.filter((subItems: Menu) => {
        if (subItems?.title?.toLowerCase().includes(term) && subItems.type === 'link') {
          subItems.icon = menuItems.icon;
          items.push(subItems);
        }
        if (!subItems.children) {
          return false;
        }
        subItems.children.filter((suSubItems: Menu) => {
          if (suSubItems?.title?.toLowerCase().includes(term)) {
            suSubItems.icon = menuItems.icon;
            items.push(suSubItems);
          }
        });
        return;
      });
      this.checkSearchResultEmpty(items);
      return (this.menuItems = items);
    });
    return;
  }

  checkSearchResultEmpty(items: Menu[]) {
    if (!items.length) {
      this.searchResultEmpty = true;
    } else {
      this.searchResultEmpty = false;
    }
  }

  addFix() {
    this.searchResult = true;
  }

  removeFix() {
    this.searchResult = false;
    this.text = '';
  }

  addToBookmark(items: Menu) {
    const index = this.bookmarkItems.indexOf(items);
    if (index === -1 && !items.bookmark) {
      items.bookmark = true;
      this.bookmarkItems.push(items);
      this.text = '';
    } else {
      this.bookmarkItems.splice(index, 1);
      items.bookmark = false;
    }
  }
}

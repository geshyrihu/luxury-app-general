import { inject, Injectable } from '@angular/core';

import { Menu, NavService } from './nav.service';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  public text: string = '';
  public itemsData: Menu[] = [];
  public menuItems: Menu[] = [];
  public searchResult: boolean = false;
  public searchResultEmpty: boolean = false;

  public navServices = inject(NavService);

  constructor() {
    this.navServices.items.subscribe(menuItems => (this.itemsData = menuItems));
  }

  searchTerm(term: string) {
    term ? this.addFix() : this.removeFix();
    if (!term) return (this.menuItems = []);
    let itemsData: Menu[] = [];
    term = term.toLowerCase();
    this.itemsData.forEach(data => {
      if (!data?.title) return false;
      if (data.title.toLowerCase().includes(term) && data.type === 'link') {
        itemsData.push(data);
      }
      if (!data.children) return false;
      data.children.filter((subItems: Menu) => {
        if (subItems.title?.toLowerCase().includes(term) && subItems.type === 'link') {
          subItems.icon = data.icon;
          itemsData.push(subItems);
        }
        if (!subItems.children) return false;
        subItems.children.filter((suSubItems: Menu) => {
          if (suSubItems.title?.toLowerCase().includes(term)) {
            suSubItems.icon = data.icon;
            itemsData.push(suSubItems);
          }
        });
        return;
      });
      this.checkSearchResultEmpty(itemsData);
      this.menuItems = itemsData;
      return;
    });
    return;
  }

  checkSearchResultEmpty(items: Menu[]) {
    if (!items.length) this.searchResultEmpty = true;
    else this.searchResultEmpty = false;
  }

  addFix() {
    this.searchResult = true;
    document.body.classList.add('offcanvas');
  }

  clickOutSide(): void {
    this.text = '';
    this.searchResult = false;
    this.searchResultEmpty = false;
    document.body.classList.remove('offcanvas');
  }

  removeFix() {
    this.text = '';
    this.searchResult = false;
    document.body.classList.remove('offcanvas');
  }
}

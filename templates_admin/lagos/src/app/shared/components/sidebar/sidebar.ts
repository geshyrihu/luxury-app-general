import { NgTemplateOutlet, NgClass } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';

import { LayoutService } from '../../services/layout.service';
import { Menu, NavService } from '../../services/nav.service';
import { CommonSvgIcon } from '../common-svg-icon/common-svg-icon';
import { FeatherIcons } from '../feather-icons/feather-icons';
import { SvgIcon } from '../svg-icon/svg-icon';

@Component({
  selector: 'app-sidebar',
  imports: [
    CommonSvgIcon,
    FeatherIcons,
    SvgIcon,
    RouterModule,
    TranslateModule,
    NgTemplateOutlet,
    NgClass,
  ],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss'],
})
export class Sidebar {
  public navService = inject(NavService);
  public layoutService = inject(LayoutService);
  private router = inject(Router);

  public margin: number = 0;
  public leftArrow: boolean = false;
  public rightArrow: boolean = true;
  public width: number = window.innerWidth;
  public isShow: boolean = false;
  public menuItemsList = this.navService.MENUITEMS;
  public pinnedData: boolean = false;
  public pinnedDataList: string[] = [];

  constructor() {
    this.navService.items.subscribe(menuItems => {
      this.menuItemsList = menuItems;
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.menuItemsList.filter((items: Menu) => {
            if (items.path === event.url) {
              this.setNavActive(items);
            }
            if (!items.children) {
              return false;
            }
            items.children.filter((subItems: Menu) => {
              if (subItems.path === event.url) {
                this.setNavActive(subItems);
              }
              if (!subItems.children) {
                return false;
              }
              subItems.children.filter((subSubItems: Menu) => {
                if (subSubItems.path === event.url) {
                  this.setNavActive(subSubItems);
                }
              });
              return;
            });
            return;
          });
        }
      });
    });
  }

  isPined(itemName: string | undefined): boolean {
    return itemName !== undefined && this.pinnedDataList?.includes(itemName);
  }

  pinned(title: string) {
    const index = this.pinnedDataList.indexOf(title);
    if (index !== -1) {
      this.pinnedDataList.splice(index, 1);
    } else {
      this.pinnedDataList.push(title);
    }
    if (this.pinnedDataList.length <= 0) {
      this.pinnedData = false;
    } else {
      this.pinnedData = true;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: UIEvent) {
    const target = event.target as Window;
    this.width = target.innerWidth - 500;
  }

  setNavActive(item: Menu) {
    this.menuItemsList.filter(menuItem => {
      if (menuItem !== item) {
        menuItem.active = false;
      }
      if (menuItem.children && menuItem.children.includes(item)) {
        menuItem.active = true;
      }
      if (menuItem.children) {
        menuItem.children.filter(submenuItems => {
          if (submenuItems.children && submenuItems.children.includes(item)) {
            menuItem.active = true;
            submenuItems.active = true;
          } else {
            submenuItems.active = false;
          }
        });
      }
    });
  }

  sidebarToggle() {
    this.navService.collapseSidebar = !this.navService.collapseSidebar;
  }

  toggleNavActive(item: Menu) {
    if (!item.active) {
      this.menuItemsList.forEach((a: Menu) => {
        if (this.menuItemsList.includes(item)) {
          a.active = false;
        }
        if (!a.children) {
          return false;
        }
        a.children.forEach((b: Menu) => {
          if (a.children?.includes(item)) {
            b.active = false;
          }
        });
        return;
      });
    }
    item.active = !item.active;
  }

  scrollToLeft() {
    this.rightArrow = true;
    if (this.layoutService.margin != 0) {
      this.layoutService.margin = this.layoutService.margin + 500;
    }

    if (this.layoutService.margin == 0) {
      this.leftArrow = false;
    }
  }

  scrollToRight() {
    this.leftArrow = true;
    if (this.layoutService.margin != -3500) {
      this.layoutService.margin = this.layoutService.margin - 500;
    }
    if (this.layoutService.margin == -3500) {
      this.rightArrow = false;
    }
  }
}

import { Directive, HostBinding, HostListener, input, output, signal } from '@angular/core';

import { productListInterface } from '../data/data/ecommerce/product-list';

export type SortColumn = keyof productListInterface | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: { [key: string]: SortDirection } = { asc: 'desc', desc: '', '': 'asc' };

export interface SortEvent {
  column: SortColumn;
  direction: SortDirection;
}

@Directive({
  selector: 'th[sortable]',
})
export class ProductListSortableDirective {
  readonly sortable = input<SortColumn>('');
  readonly direction = input<SortDirection>('');

  public currentDirection = signal<SortDirection>(this.direction());

  readonly sort = output<SortEvent>();

  @HostBinding('class.asc') get isAsc() {
    return this.currentDirection() === 'asc';
  }
  @HostBinding('class.desc') get isDesc() {
    return this.currentDirection() === 'desc';
  }

  @HostListener('click')
  rotateColumn() {
    this.currentDirection.set(rotate[this.currentDirection()]);
    this.sort.emit({ column: this.sortable(), direction: this.currentDirection() });
  }
}

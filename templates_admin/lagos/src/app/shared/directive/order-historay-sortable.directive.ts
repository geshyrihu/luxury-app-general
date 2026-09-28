import { Directive, HostBinding, HostListener, input, output, signal } from '@angular/core';

import { orderTable } from '../data/data/ecommerce/order-history';

export type SortColumn = keyof orderTable | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: { [key: string]: SortDirection } = { asc: 'desc', desc: '', '': 'asc' };

export interface SortEvent {
  column: SortColumn;
  direction: SortDirection;
}

@Directive({
  selector: 'th[sortableOrder]',
})
export class orderHistoraySortableDirective {
  readonly sortableOrder = input<SortColumn>('');
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
    this.sort.emit({ column: this.sortableOrder(), direction: this.currentDirection() });
  }
}

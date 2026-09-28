import { Directive, HostBinding, HostListener, input, output, signal } from '@angular/core';

import { supportDB } from '../data/data/support-tickit/support-tickit';

export type SortColumn = keyof supportDB | '';
export type SortDirection = 'asc' | 'desc' | '';

const rotate: { [key: string]: SortDirection } = { asc: 'desc', desc: '', '': 'asc' };

export interface SortEvent {
  column: SortColumn;
  direction: SortDirection;
}
@Directive({
  selector: 'th[sortable]',
})
export class SupportTicketDirective {
  // Input signals
  readonly sortable = input<SortColumn>(''); // Column name
  readonly direction = input<SortDirection>(''); // Initial direction

  // Local writable signal
  public currentDirection = signal<SortDirection>(this.direction());

  // Output event
  readonly sort = output<SortEvent>();

  // HostBinding for CSS classes
  @HostBinding('class.asc')
  get isAsc() {
    return this.currentDirection() === 'asc';
  }

  @HostBinding('class.desc')
  get isDesc() {
    return this.currentDirection() === 'desc';
  }

  // Handle click
  @HostListener('click')
  rotate() {
    this.currentDirection.set(rotate[this.currentDirection()]);
    this.sort.emit({ column: this.sortable(), direction: this.currentDirection() });
  }
}

import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, inject, Injectable } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of, OperatorFunction } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  tap,
  switchMap,
} from 'rxjs/operators';

const WIKI_URL = 'https://en.wikipedia.org/w/api.php';

const PARAMS = new HttpParams({
  fromObject: {
    action: 'opensearch',
    format: 'json',
    origin: '*',
  },
});

@Injectable()
@Injectable()
export class WikipediaService {
  private http = inject(HttpClient);

  search(term: string) {
    if (term === '') {
      return of([]);
    }

    return this.http
      .get<[string, string[]]>(WIKI_URL, { params: PARAMS.set('search', term) })
      .pipe(map(response => response[1]));
  }
}

@Component({
  selector: 'app-wikipedia-search',
  templateUrl: './wikipedia-search.html',
  styleUrls: ['./wikipedia-search.scss'],
  imports: [FormsModule, NgbModule],
  providers: [WikipediaService],
})
export class WikipediaSearch {
  public model: string;
  public searching = false;
  public searchFailed = false;

  private _service = inject(WikipediaService);

  search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => (this.searching = true)),
      switchMap(term =>
        this._service.search(term).pipe(
          tap(() => (this.searchFailed = false)),
          catchError(() => {
            this.searchFailed = true;
            return of([]);
          }),
        ),
      ),
      tap(() => (this.searching = false)),
    );
}

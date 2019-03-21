import {Injectable} from '@angular/core';
import {DeleteSnackBarComponent} from '../core/delete-snack-bar/delete-snack-bar.component';
import {MatSnackBar} from '@angular/material';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MaterialTableService {

  constructor(
    private snackBar: MatSnackBar
  ) {
  }

  calcNextPage(params: { currentPage: number, countOfPages: number, nextOffset?: number, nextPage?: number, event: any }): number {
    let result = params.currentPage;
    if (params.nextOffset) {
      if (params.nextOffset == 1 && params.currentPage !== params.countOfPages) {
        ++result;
      } else if (params.nextOffset == -1 && params.currentPage > 1) {
        --result;
      }
    } else if (params.nextPage && params.nextPage <= params.countOfPages && params.nextPage >= 1) {
      result = params.nextPage;
    }
    if (params.event) {
      params.event.target.value = result;
    }
    return result;
  }

  calcCountOfPages(count, limit): number {
    const countOfPages = Math.ceil(count / limit);
    return countOfPages ? countOfPages : 1;
  }


  sort(header: string, headerBlock: HTMLElement, event: any): string {
    this.setNextSortState(event.target, header);
    const headerElements = headerBlock.getElementsByTagName('td');
    for (let i = 0; i < headerElements.length; i++) {
      const headerElement: HTMLElement = headerElements[i];
      if (headerElement.innerText !== event.target.innerText && headerElement.dataset.sort) {
        headerElement.dataset.sort = '';
        headerElement.setAttribute('class', '');
      }
    }
    if (event.target.dataset.sort.indexOf('ASC') > -1 || event.target.dataset.sort.indexOf('DESC') > -1) {
      return event.target.dataset.sort.split('.').join(' ');
    } else {
      return '';
    }
  }

  private getNextDirection(oldDirection: string) {
    if (oldDirection === '') {
      return 'ASC';
    }
    if (oldDirection === 'ASC') {
      return 'DESC';
    }
    return '';
  }

  private setNextSortState(element: HTMLElement, header: string) {
    const currentSort = element.dataset.sort ? element.dataset.sort.split(' ') : [header, ''];
    const nextSort = [header, this.getNextDirection(currentSort[1])];
    if (nextSort[1] === '') {
      element.setAttribute('class', '');
    }
    if (nextSort[1] === 'ASC') {
      element.setAttribute('class', 'sort-asc');
    }
    if (nextSort[1] === 'DESC') {
      element.setAttribute('class', 'sort-desc');
    }
    element.dataset.sort = nextSort.join(' ');
  }

  getFilter(filterBlock: HTMLElement): any {
    const query = {};
    const inputs = filterBlock.getElementsByTagName('input');
    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      if (input.value) {
        query[input.dataset.key] = input.value;
      }
    }
    return query;
  }

  showRemoveSnackBar(): Observable<void> {
    const deleteSnackBarRef = this.snackBar.openFromComponent(DeleteSnackBarComponent, {
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
    return deleteSnackBarRef.onAction();
  }

}

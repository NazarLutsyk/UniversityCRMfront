import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {DeleteSnackBarComponent} from './delete-snack-bar/delete-snack-bar.component';

export interface MaterialTableHeader {
  header: string;
  key: string;
  filtered: boolean;
}

@Component({
  selector: 'app-material-table',
  templateUrl: './material-table.component.html',
  styleUrls: ['./material-table.component.css']
})
export class MaterialTableComponent implements OnInit, OnChanges {

  @Input() dataSource = [];
  @Input() headers: MaterialTableHeader[] = [];
  @Input() count = 0;
  @Input() pageSize = 1;
  @Input() pageIndex = 1;

  @Output() onSort = new EventEmitter<string>();
  @Output() onFilter = new EventEmitter<any>();
  @Output() onPagination = new EventEmitter<any>();
  @Output() onRemove = new EventEmitter<any>();
  @Output() onOpen = new EventEmitter<any>();

  countOfPages = 1;

  constructor(
    public snackBar: MatSnackBar
  ) {
  }

  ngOnInit() {
    this.countOfPages = Math.ceil(this.count / this.pageSize);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.count = changes.count ? changes.count.currentValue : this.count;
    this.pageIndex = changes.pageIndex ? changes.pageIndex.currentValue : this.pageIndex;
    this.countOfPages = Math.ceil(this.count / this.pageSize);
  }

  sort(header: MaterialTableHeader, headerBlock: HTMLElement, event: any) {
    const sort = '';
    this.setNextSortState(event.target, header);
    const headerElements = headerBlock.getElementsByTagName('td');
    for (let i = 0; i < headerElements.length; i++) {
      const headerElement: HTMLElement = headerElements[i];
      if (headerElement.innerText !== event.target.innerText) {
        headerElement.dataset.sort = '';
        headerElement.setAttribute('class', '');
      }
    }
    if (event.target.dataset.sort.split(' ')[1]) {
      this.onSort.emit(event.target.dataset.sort);
    } else {
      this.onSort.emit('');
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

  private setNextSortState(element: HTMLElement, header: MaterialTableHeader) {
    const currentSort = element.dataset.sort ? element.dataset.sort.split(' ') : [header.key, ''];
    const nextSort = [header.key, this.getNextDirection(currentSort[1])];
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

  onKeyUp(header: MaterialTableHeader, filterBlock: HTMLElement, $event) {
    const query = {};
    const inputs = filterBlock.getElementsByTagName('input');
    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      if (input.value) {
        query[input.dataset.key] = input.value;
      }
    }
    this.onFilter.emit(query);
  }

  setPage(number, $event) {
    const prevPage = this.pageIndex;
    if (number) {
      if (number == 1 && this.pageIndex !== this.countOfPages) {
        ++this.pageIndex;
      } else if (number == -1 && this.pageIndex > 1) {
        --this.pageIndex;
      }
    } else if ($event) {
      const inputtedPage = +$event.target.value;
      if (inputtedPage) {
        if (inputtedPage > this.countOfPages) {
          $event.target.value = this.countOfPages;
          this.pageIndex = this.countOfPages;
        } else {
          this.pageIndex = inputtedPage;
        }
      }
    }
    if (prevPage !== this.pageIndex) {
      this.onPagination.emit(this.pageIndex);
    }
  }

  blurPaginator($event) {
    const value = $event.target.value;
    if (!value) {
      $event.target.value = 1;
      this.pageIndex = 1;
      this.onPagination.emit(this.pageIndex);
    }
  }

  remove(id) {
    const deleteSnackBarRef = this.snackBar.openFromComponent(DeleteSnackBarComponent, {
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
    deleteSnackBarRef.onAction().subscribe(() => {
      this.onRemove.emit(id);
    });
  }

  openData(id: any, $event) {
    const isControl = $event.target.dataset.controls;
    if (isControl) {
      return false;
    }
    this.onOpen.emit(id);
  }
}


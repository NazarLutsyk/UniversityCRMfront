import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

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
export class MaterialTableComponent implements OnInit {

  @Input() dataSource = [];
  @Input() headers: MaterialTableHeader[] = [];
  @Output() onSort = new EventEmitter<string>();
  @Output() onFilter = new EventEmitter<any>();


  constructor() {
  }

  ngOnInit() {
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
}


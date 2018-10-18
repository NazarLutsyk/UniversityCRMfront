import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MaterialTableService} from '../../services/material-table.service';
import {Observable} from 'rxjs';
import {NgForm} from '@angular/forms';
import {Source} from '../../models/source';
import {SourceService} from '../../services/source.service';
import {isNumber} from 'util';

@Component({
  selector: 'app-sources',
  templateUrl: './sources.component.html',
  styleUrls: ['./sources.component.css']
})
export class SourcesComponent implements OnInit {

  sources: Source[] = [];
  count = 0;

  pageIndex = 1;
  pageSize = 9;
  countOfPages = 1;

  sort = '';
  filter: any = {};

  constructor(
    private sourcesService: SourceService,
    private router: Router,
    public materialTableService: MaterialTableService
  ) {
  }

  ngOnInit() {
    this.loadSources();
  }

  loadSources() {
    this.sendLoadSources().subscribe(response => {
      this.count = response.count;
      this.sources = response.models;
      this.countOfPages = this.materialTableService.calcCountOfPages(this.count, this.pageSize);
    });
  }

  loadSorted(key: string, headerBlock: HTMLElement, event: any) {
    this.sort = this.materialTableService.sort(key, headerBlock, event);
    this.loadSources();
  }

  loadFiltered(headerBlock: HTMLElement) {
    this.filter = this.materialTableService.getFilter(headerBlock);
    this.loadSources();
  }

  loadPaginated(offset: number, event: any) {
    this.pageIndex = this.materialTableService.calcNextPage({
      countOfPages: this.countOfPages,
      currentPage: this.pageIndex,
      nextOffset: offset,
      nextPage: event ? event.target.value : 0,
      event: event
    });
    this.loadSources();
  }

  private sendLoadSources(): Observable<any> {
    const filterToSend = this.getFilterToSend();
    return this.sourcesService.getSources({
      q: filterToSend,
      sort: this.sort ? this.sort : 'createdAt DESC',
      limit: this.pageSize,
      offset: (this.pageIndex * this.pageSize) - this.pageSize
    });
  }

  private getFilterToSend() {
    const res: any = {};

    if (this.filter.name) {
      res.name = {$like: `${this.filter.name}`};
    }
    return res;
  }

  createSource(sourceForm: NgForm) {
    const source: Source = <Source>sourceForm.form.value;
    this.sourcesService.create(source).subscribe((sourceResponse) => {
      sourceForm.resetForm();
      this.loadSources();
    });
  }

  remove(id) {
    this.materialTableService.showRemoveSnackBar().subscribe(() => {
      this.sourcesService.remove(id).subscribe((removed) => {
        const countOfPages = Math.ceil((this.count - 1) / this.pageSize);
        if (countOfPages < this.pageIndex && this.pageIndex > 1 && countOfPages !== 0) {
          --this.pageIndex;
        }
        this.loadSources();
      });
    });
  }

  open(id, url, $event) {
    $event.stopPropagation();
    const isControl = $event.target.dataset.controls;
    if (isControl || !isNumber(id)) {
      return false;
    }
    this.router.navigate([...url.split('/'), id]);
  }
}

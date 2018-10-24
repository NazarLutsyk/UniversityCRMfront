import {Component, Input, OnInit} from '@angular/core';
import {Group} from '../../../models/group';
import {GroupService} from '../../../services/group.service';
import {Router} from '@angular/router';
import {MaterialTableService} from '../../../services/material-table.service';
import {Observable} from 'rxjs';
import {isNumber} from 'util';

@Component({
  selector: 'app-groups-table',
  templateUrl: './groups-table.component.html',
  styleUrls: ['./groups-table.component.css']
})
export class GroupsTableComponent implements OnInit {

  @Input() byCourseId;

  groups: Group[] = [];

  count = 0;

  pageIndex = 1;
  pageSize = 9;
  countOfPages = 1;

  sort = '';
  filter: any = {};


  constructor(
    private groupsService: GroupService,
    private router: Router,
    public materialTableService: MaterialTableService
  ) {
  }

  ngOnInit() {
    this.loadGroups();
  }

  loadGroups() {
    this.sendLoadGroups().subscribe(response => {
      this.count = response.count;
      this.groups = response.models;
      this.countOfPages = this.materialTableService.calcCountOfPages(this.count, this.pageSize);
    });
  }

  loadSorted(key: string, headerBlock: HTMLElement, event: any) {
    this.sort = this.materialTableService.sort(key, headerBlock, event);
    this.loadGroups();
  }

  loadFiltered(headerBlock: HTMLElement) {
    this.filter = this.materialTableService.getFilter(headerBlock);
    this.loadGroups();
  }

  loadPaginated(offset: number, event: any) {
    this.pageIndex = this.materialTableService.calcNextPage({
      countOfPages: this.countOfPages,
      currentPage: this.pageIndex,
      nextOffset: offset,
      nextPage: event ? event.target.value : 0,
      event: event
    });
    this.loadGroups();
  }

  private sendLoadGroups(): Observable<any> {
    const filterToSend = this.getFilterToSend();
    return this.groupsService.getGroups({
      q: filterToSend,
      sort: this.sort ? this.sort : 'createdAt DESC',
      limit: this.pageSize,
      offset: (this.pageIndex * this.pageSize) - this.pageSize,
      include: ['course']
    });
  }

  private getFilterToSend() {
    const res: any = {};

    if (this.filter.name) {
      res.name = {$like: `${this.filter.name}`};
    }
    if (this.filter['course.name']) {
      res.course = {name: `${this.filter['course.name']}`};
    }
    if (this.byCourseId) {
      res.course = {id: this.byCourseId};
    }

    return res;
  }

  remove(id) {
    this.materialTableService.showRemoveSnackBar().subscribe(() => {
      this.groupsService.remove(id).subscribe((removed) => {
        const countOfPages = Math.ceil((this.count - 1) / this.pageSize);
        if (countOfPages < this.pageIndex && this.pageIndex > 1 && countOfPages !== 0) {
          --this.pageIndex;
        }
        this.loadGroups();
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

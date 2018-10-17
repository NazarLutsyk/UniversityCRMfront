import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MaterialTableService} from '../../services/material-table.service';
import {Observable} from 'rxjs';
import {NgForm} from '@angular/forms';
import {Task} from '../../models/task';
import {TaskService} from '../../services/task.service';
import {isNumber} from 'util';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  tasks: Task[] = [];
  count = 0;

  pageIndex = 1;
  pageSize = 9;
  countOfPages = 1;

  sort = '';
  filter: any = {};

  constructor(
    private tasksService: TaskService,
    private router: Router,
    public materialTableService: MaterialTableService
  ) {
  }

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.sendLoadTasks().subscribe(response => {
      this.count = response.count;
      this.tasks = response.models;
      this.countOfPages = this.materialTableService.calcCountOfPages(this.count, this.pageSize);
    });
  }

  loadSorted(key: string, headerBlock: HTMLElement, event: any) {
    this.sort = this.materialTableService.sort(key, headerBlock, event);
    this.loadTasks();
  }

  loadFiltered(headerBlock: HTMLElement) {
    this.filter = this.materialTableService.getFilter(headerBlock);
    this.loadTasks();
  }

  loadPaginated(offset: number, event: any) {
    this.pageIndex = this.materialTableService.calcNextPage({
      countOfPages: this.countOfPages,
      currentPage: this.pageIndex,
      nextOffset: offset,
      nextPage: event ? event.target.value : 0,
      event: event
    });
    this.loadTasks();
  }

  private sendLoadTasks(): Observable<any> {
    const filterToSend = this.getFilterToSend();
    return this.tasksService.getTasks({
      q: filterToSend,
      include: ['client'],
      sort: this.sort ? this.sort : 'createdAt DESC',
      limit: this.pageSize,
      offset: (this.pageIndex * this.pageSize) - this.pageSize
    });
  }

  private getFilterToSend() {
    const res: any = {};

    if (this.filter.message) {
      res.message = {$like: `${this.filter.message}`};
    }
    if (this.filter['client.name']) {
      res.client = {name: `${this.filter['client.name']}`};
    }
    return res;
  }

  createTask(form: NgForm) {
    const task: Task = <Task>form.form.value;
    this.tasksService.create(task).subscribe((clientResponse) => {
      form.resetForm();
      this.loadTasks();
    });
  }

  remove(id) {
    this.materialTableService.showRemoveSnackBar().subscribe(() => {
      this.tasksService.remove(id).subscribe((removed) => {
        const countOfPages = Math.ceil((this.count - 1) / this.pageSize);
        if (countOfPages < this.pageIndex && this.pageIndex > 1 && countOfPages !== 0) {
          --this.pageIndex;
        }
        this.loadTasks();
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

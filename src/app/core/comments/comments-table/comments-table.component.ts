import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MaterialTableService} from '../../../services/material-table.service';
import {Observable} from 'rxjs';
import {Comment} from '../../../models/comment';
import {CommentService} from '../../../services/comment.service';

@Component({
  selector: 'app-comments-table',
  templateUrl: './comments-table.component.html',
  styleUrls: ['./comments-table.component.css']
})
export class CommentsTableComponent implements OnInit {

  @Input() byClientId;

  comments: Comment[] = [];

  count = 0;

  pageIndex = 1;
  pageSize = 9;
  countOfPages = 1;

  sort = '';
  filter: any = {};

  constructor(
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public materialTableService: MaterialTableService,
    public commentService: CommentService,
  ) {
  }

  ngOnInit() {
    this.loadComments();
  }

  loadComments() {
    this.sendLoadComments().subscribe(response => {
      this.count = response.count;
      this.comments = response.models;
      this.countOfPages = this.materialTableService.calcCountOfPages(this.count, this.pageSize);
    });
  }

  loadSorted(key: string, headerBlock: HTMLElement, event: any) {
    this.sort = this.materialTableService.sort(key, headerBlock, event);
    this.loadComments();
  }

  loadFiltered(headerBlock: HTMLElement) {
    this.filter = this.materialTableService.getFilter(headerBlock);
    this.loadComments();
  }

  loadPaginated(offset: number, event: any) {
    this.pageIndex = this.materialTableService.calcNextPage({
      countOfPages: this.countOfPages,
      currentPage: this.pageIndex,
      nextOffset: offset,
      nextPage: event ? event.target.value : 0,
      event: event
    });
    this.loadComments();
  }

  private sendLoadComments(): Observable<any> {
    const filterToSend = this.getFilterToSend();
    return this.commentService.getComments({
      q: filterToSend,
      sort: this.sort ? this.sort : 'createdAt DESC',
      limit: this.pageSize,
      offset: (this.pageIndex * this.pageSize) - this.pageSize,
      attributes: ['id', 'text', 'date', 'clientId']
    });
  }

  private getFilterToSend() {
    const res: any = {};
    if (this.filter.text) {
      res.text = {$like: `${this.filter.text}`};
    }
    if (this.byClientId) {
      res.clientId = this.byClientId;
    }
    return res;
  }

  remove(id) {
    this.materialTableService.showRemoveSnackBar().subscribe(() => {
      this.commentService.remove(id).subscribe((removed) => {
        const countOfPages = Math.ceil((this.count - 1) / this.pageSize);
        if (countOfPages < this.pageIndex && this.pageIndex > 1 && countOfPages !== 0) {
          --this.pageIndex;
        }
        this.loadComments();
      });
    });
  }

}

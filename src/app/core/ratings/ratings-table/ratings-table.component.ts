import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MaterialTableService} from '../../../services/material-table.service';
import {AuthService} from '../../../services/auth.service';
import {Observable} from 'rxjs';
import {isNumber} from 'util';
import {Rating} from '../../../models/Rating';
import {RatingService} from '../../../services/rating.service';

@Component({
  selector: 'app-ratings-table',
  templateUrl: './ratings-table.component.html',
  styleUrls: ['./ratings-table.component.css']
})
export class RatingsTableComponent implements OnInit {

  ratings: Rating[] = [];

  courseId = null;

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
    public ratingService: RatingService,
    public authService: AuthService
  ) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(({id}) => {
      this.courseId = id;
      this.loadRatings();
    });
  }

  loadRatings() {
    this.sendLoadRatings().subscribe(response => {
      this.count = response.count;
      this.ratings = response.models;
      this.countOfPages = this.materialTableService.calcCountOfPages(this.count, this.pageSize);
    });
  }

  loadFiltered(headerBlock: HTMLElement) {
    this.filter = this.materialTableService.getFilter(headerBlock);
    this.loadRatings();
  }

  loadPaginated(offset: number, event: any) {
    this.pageIndex = this.materialTableService.calcNextPage({
      countOfPages: this.countOfPages,
      currentPage: this.pageIndex,
      nextOffset: offset,
      nextPage: event ? event.target.value : 0,
      event: event
    });
    this.loadRatings();
  }

  private sendLoadRatings(): Observable<any> {
    const filterToSend = this.getFilterToSend();
    return this.ratingService.getRatingByCourseId(this.courseId, {
      q: filterToSend,
      sort: this.sort ? this.sort : '',
      limit: this.pageSize,
      offset: (this.pageIndex * this.pageSize) - this.pageSize,
    });
  }

  private getFilterToSend() {
    const res: any = {};
    if (this.filter['fullname']) {
      res.fullname = this.filter['fullname'];
    }
    return res;
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

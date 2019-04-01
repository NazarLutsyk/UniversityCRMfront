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
  background = 'red';
  courseId = null;

  count: number;

  pageIndex = 1;
  pageSize = 40;
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
      this.ratings = response.models;
      this.countOfPages = this.materialTableService.calcCountOfPages(this.count, this.pageSize);
      for (let i = 0; i < this.ratings.length; i++) {
        this.ratings[i]['background'] = this.randomColor();
        this.ratings[i]['widthBlock'] = this.widthOfVisitedBlock(this.ratings[i].full, this.ratings[i].visited);
      }
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
    this.ratingService.getRatingByCourseId(this.courseId, {
      q: filterToSend
    }).subscribe((res: any) => {
     this.count = res.models.length;
   });
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

  randomColor() {
    const firstNumber = Math.ceil(Math.random() * 200);
    const secondNumber = Math.ceil(Math.random() * 200);
    const thirdNumber = Math.ceil(Math.random() * 200);

    return `rgb(${firstNumber}, ${secondNumber}, ${thirdNumber})`;
  }

  widthOfVisitedBlock(a, b) {
    const x = (b * 100) / a;
    const result = (50 * x) / 100;
    return `${result}vw`;
  }

}

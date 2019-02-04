import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {MatExpansionPanel} from '@angular/material';
import {Competitor} from '../../models/competitor';
import {CompetitorService} from '../../services/competitor.service';
import {Router} from '@angular/router';
import {MaterialTableService} from '../../services/material-table.service';
import {AuthService} from '../../services/auth.service';
import {Observable} from 'rxjs';
import {isNumber} from 'util';

@Component({
  selector: 'app-competitors',
  templateUrl: './competitors.component.html',
  styleUrls: ['./competitors.component.css']
})
export class CompetitorsComponent implements OnInit {


  @ViewChild('form') competitorForm: NgForm;
  @ViewChild('formPanel') formPanel: MatExpansionPanel;

  competitors: Competitor[] = [];

  count = 0;
  pageIndex = 1;
  pageSize = 9;
  countOfPages = 1;

  sort = '';
  filter: any = {};

  constructor(
    private competitorsService: CompetitorService,
    private router: Router,
    public materialTableService: MaterialTableService,
    public authService: AuthService
  ) {
  }

  ngOnInit() {
    this.loadCompetitors();
  }

  loadCompetitors() {
    this.sendLoadCompetitors().subscribe(response => {
      this.count = response.count;
      this.competitors = response.models;
      this.countOfPages = this.materialTableService.calcCountOfPages(this.count, this.pageSize);
    });
  }

  loadSorted(key: string, headerBlock: HTMLElement, event: any) {
    this.sort = this.materialTableService.sort(key, headerBlock, event);
    this.loadCompetitors();
  }

  loadFiltered(headerBlock: HTMLElement) {
    this.filter = this.materialTableService.getFilter(headerBlock);
    this.loadCompetitors();
  }

  loadPaginated(offset: number, event: any) {
    this.pageIndex = this.materialTableService.calcNextPage({
      countOfPages: this.countOfPages,
      currentPage: this.pageIndex,
      nextOffset: offset,
      nextPage: event ? event.target.value : 0,
      event: event
    });
    this.loadCompetitors();
  }

  private sendLoadCompetitors(): Observable<any> {
    const filterToSend = this.getFilterToSend();
    return this.competitorsService.getCompetitors({
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

  createCompetitor(competitorForm: NgForm) {
    const competitor: Competitor = <Competitor>competitorForm.form.value;
    this.competitorsService.create(competitor).subscribe((competitorResponse) => {
      competitorForm.resetForm();
      this.loadCompetitors();
    });
  }

  remove(id) {
    this.materialTableService.showRemoveSnackBar().subscribe(() => {
      this.competitorsService.remove(id).subscribe((removed) => {
        const countOfPages = Math.ceil((this.count - 1) / this.pageSize);
        if (countOfPages < this.pageIndex && this.pageIndex > 1 && countOfPages !== 0) {
          --this.pageIndex;
        }
        this.loadCompetitors();
      });
    });
  }

  open(competitor, url, $event) {
    $event.stopPropagation();
    const isControl = $event.target.dataset.controls;
    if (isControl || !isNumber(competitor.id)) {
      return false;
    }
    this.router.navigate([...url.split('/'), competitor.id]);
  }
}

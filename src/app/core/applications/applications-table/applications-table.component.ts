import {Component, Input, OnInit} from '@angular/core';
import {Application} from '../../../models/application';
import {ActivatedRoute, Router} from '@angular/router';
import {MaterialTableService} from '../../../services/material-table.service';
import {ApplicationService} from '../../../services/application.service';
import {Observable} from 'rxjs';
// @ts-ignore
import {isNumber} from 'util';
import {AuthService} from '../../../services/auth.service';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-applications-table',
  templateUrl: './applications-table.component.html',
  styleUrls: ['./applications-table.component.css']
})
export class ApplicationsTableComponent implements OnInit {

  @Input() byGroupId;
  @Input() byClientId;
  @Input() canDeleteApplicationInput = null;

  applications: Application[] = [];
  count = 0;

  $quantityGroupStudents = new Subject<string>();

  pageIndex = 1;
  pageSize = 50;
  countOfPages = 1;

  sort = '';
  filter: any = {};

  canDeleteApplication = false;

  constructor(
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public materialTableService: MaterialTableService,
    public applicationService: ApplicationService,
    public authService: AuthService
  ) {
  }

  ngOnInit() {
    this.loadApplications();
    if (typeof this.canDeleteApplicationInput !== 'boolean') {
      const p = this.authService.getLocalPrincipal();
      this.canDeleteApplication = (p && [this.authService.roles.BOSS_ROLE, this.authService.roles.MANAGER_ROLE].indexOf(p.role) > -1);
    } else {
      this.canDeleteApplication = this.canDeleteApplicationInput;
    }
  }

  loadApplications() {
    if (this.pageSize) {
      this.authService.getPrincipal().subscribe(() => {
        this.sendLoadApplications().subscribe(response => {
          this.count = response.count;
          this.applications = response.models;
          this.countOfPages = this.materialTableService.calcCountOfPages(this.count, this.pageSize);
          this.$quantityGroupStudents.next(response.count);
        });
      });
    }
  }

  loadSorted(key: string, headerBlock: HTMLElement, event: any) {
    this.sort = this.materialTableService.sort(key, headerBlock, event);
    this.loadApplications();
  }

  loadFiltered(headerBlock: HTMLElement) {
    this.filter = this.materialTableService.getFilter(headerBlock);
    this.loadApplications();
  }

  loadPaginated(offset: number, event: any) {
    this.pageIndex = this.materialTableService.calcNextPage({
      countOfPages: this.countOfPages,
      currentPage: this.pageIndex,
      nextOffset: offset,
      nextPage: event ? event.target.value : 0,
      event: event
    });
    this.loadApplications();
  }

  private sendLoadApplications(): Observable<any> {
    const filterToSend = this.getFilterToSend();
    return this.applicationService.getApplications({
      q: filterToSend,
      sort: this.sort ? this.sort : 'createdAt DESC',
      limit: this.pageSize,
      offset: (this.pageIndex * this.pageSize) - this.pageSize,
      include: ['client', 'course', 'group', 'city']
    });
  }

  private getFilterToSend() {
    const res: any = {};

    if (this.filter['client.fullname']) {
      res.client = {fullname: `${this.filter['client.fullname']}`};
    }
    if (this.filter['course.name']) {
      res.course = {name: `${this.filter['course.name']}`};
    }
    if (this.filter['group.name']) {
      res.group = {name: `${this.filter['group.name']}`};
    }
    if (this.filter['city.name']) {
      res.city = {name: `${this.filter['city.name']}`};
    }
    if (this.filter.certificate) {
      res.certificate = {$like: `${this.filter.certificate}`};
    }
    if (this.filter.fullPrice) {
      res.fullPrice = this.filter.fullPrice;
    }
    if (this.filter.discount) {
      res.discount = this.filter.discount;
    }
    if (this.filter.wantPractice === '+' || this.filter.wantPractice === '-') {
      res.wantPractice = this.filter.wantPractice === '+' ? 1 : this.filter.wantPractice === '-' ? 0 : null;
    }
    if (this.filter.hasPractice === '+' || this.filter.hasPractice === '-') {
      res.hasPractice = this.filter.hasPractice === '+' ? 1 : this.filter.hasPractice === '-' ? 0 : null;
    }
    if (this.filter.leftToPay) {
      res.leftToPay = this.filter.leftToPay;
    }
    if (this.byGroupId) {
      res.group = {id: this.byGroupId, ...res.group};
    }
    if (this.byClientId) {
      res.client = {id: this.byClientId, ...res.client};
    }
    if (!this.byClientId) {
      res.$or = [
        {
          cityId: this.authService.getLocalPrincipal().cities.map(c => c.id)
        },
        {
          cityId: null
        }
      ];
    }
    return res;
  }

  remove(id) {
    this.materialTableService.showRemoveSnackBar().subscribe(() => {
      this.applicationService.remove(id).subscribe((removed) => {
        const countOfPages = Math.ceil((this.count - 1) / this.pageSize);
        if (countOfPages < this.pageIndex && this.pageIndex > 1 && countOfPages !== 0) {
          --this.pageIndex;
        }
        this.loadApplications();
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

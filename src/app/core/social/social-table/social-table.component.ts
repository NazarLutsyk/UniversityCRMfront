import {Component, Input, OnInit} from '@angular/core';
import {Social} from '../../../models/social';
import {ActivatedRoute, Router} from '@angular/router';
import {MaterialTableService} from '../../../services/material-table.service';
import {SocialService} from '../../../services/social.service';
import {Observable} from 'rxjs';
import {MatDialog} from '@angular/material';
import {UpdateSocialComponent} from '../update-social/update-social.component';

@Component({
  selector: 'app-social-table',
  templateUrl: './social-table.component.html',
  styleUrls: ['./social-table.component.css']
})
export class SocialTableComponent implements OnInit {

  @Input() byClientId;

  socials: Social[] = [];

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
    public socialService: SocialService,
    private updateDialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.loadSocials();
  }

  loadSocials() {
    this.sendLoadSocials().subscribe(response => {
      this.count = response.count;
      this.socials = response.models;
      this.countOfPages = this.materialTableService.calcCountOfPages(this.count, this.pageSize);
    });
  }

  loadSorted(key: string, headerBlock: HTMLElement, event: any) {
    this.sort = this.materialTableService.sort(key, headerBlock, event);
    this.loadSocials();
  }

  loadFiltered(headerBlock: HTMLElement) {
    this.filter = this.materialTableService.getFilter(headerBlock);
    this.loadSocials();
  }

  loadPaginated(offset: number, event: any) {
    this.pageIndex = this.materialTableService.calcNextPage({
      countOfPages: this.countOfPages,
      currentPage: this.pageIndex,
      nextOffset: offset,
      nextPage: event ? event.target.value : 0,
      event: event
    });
    this.loadSocials();
  }

  private sendLoadSocials(): Observable<any> {
    const filterToSend = this.getFilterToSend();
    return this.socialService.getSocials({
      q: filterToSend,
      sort: this.sort ? this.sort : 'createdAt DESC',
      limit: this.pageSize,
      offset: (this.pageIndex * this.pageSize) - this.pageSize,
      attributes: ['id', 'url', 'clientId']
    });
  }

  private getFilterToSend() {
    const res: any = {};
    if (this.filter.url) {
      res.url = {$like: `${this.filter.url}`};
    }
    if (this.byClientId) {
      res.clientId = this.byClientId;
    }
    return res;
  }

  remove(id) {
    this.materialTableService.showRemoveSnackBar().subscribe(() => {
      this.socialService.remove(id).subscribe((removed) => {
        const countOfPages = Math.ceil((this.count - 1) / this.pageSize);
        if (countOfPages < this.pageIndex && this.pageIndex > 1 && countOfPages !== 0) {
          --this.pageIndex;
        }
        this.loadSocials();
      });
    });
  }


  updateSocial(social: Social) {
    const matDialogRef = this.updateDialog.open(UpdateSocialComponent, {
      disableClose: true,
      minWidth: '40%',
      data: {
        social
      }
    });
    matDialogRef.afterClosed().subscribe((updated) => {
      if (updated && updated.url) {
        social.url = updated.url;
      }
    });
  }
}

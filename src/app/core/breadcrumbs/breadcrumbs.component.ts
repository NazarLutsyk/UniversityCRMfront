import {Component, OnInit} from '@angular/core';
import {BreadCrumb, BreadcrumbsService} from '../../services/breadcrumbs.service';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.css']
})
export class BreadcrumbsComponent implements OnInit {

  breadcrumbs: BreadCrumb[] = [];

  constructor(
    public breadcrumbsService: BreadcrumbsService
  ) {
  }

  ngOnInit() {
    this.breadcrumbsService.getBreadCrumbs().subscribe((breadcrumbs) => this.breadcrumbs = breadcrumbs);
  }

}

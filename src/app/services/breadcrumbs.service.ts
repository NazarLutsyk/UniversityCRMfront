import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {distinctUntilChanged, filter, map} from 'rxjs/operators';

export interface BreadCrumb {
  label: string;
  url: string;
}

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbsService {

  private breadcrumbs$: Observable<BreadCrumb[]>;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.loadBreadCrumbs();
  }

  getBreadCrumbs(): Observable<BreadCrumb[]> {
    this.loadBreadCrumbs();
    return this.breadcrumbs$;
  }

  private loadBreadCrumbs(): void {
    this.breadcrumbs$ = this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        distinctUntilChanged(),
        map(event => this.buildBreadCrumb(this.activatedRoute.root))
      );
  }

  private buildBreadCrumb(route: ActivatedRoute, url: string = '', breadcrumbs: BreadCrumb[] = []): BreadCrumb[] {
    const label = route.routeConfig && route.routeConfig.data ? route.routeConfig.data['breadcrumb'] : '';
    if (label) {
      const path = route.snapshot.url.join('/');
      const nextUrl = `${url}${path}/`;
      const breadcrumb = {
        label: label,
        url: nextUrl
      };
      const newBreadcrumbs = [...breadcrumbs, breadcrumb];
      if (route.firstChild) {
        return this.buildBreadCrumb(route.firstChild, nextUrl, newBreadcrumbs);
      }
      return newBreadcrumbs;
    } else if (route.firstChild) {
      return this.buildBreadCrumb(route.firstChild, url, breadcrumbs);
    } else {
      return breadcrumbs;
    }
  }
}

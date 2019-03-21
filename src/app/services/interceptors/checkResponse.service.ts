import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {DbLoadStatusService} from '../db-load-status.service';

@Injectable()
export class CheckResponseInterceptorService implements HttpInterceptor {

private counter = 0;
  constructor(
    private dbLoadStatusService: DbLoadStatusService
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.indexOf('api') > -1) {
      this.dbLoadStatusService.$statusPreloadingData.next('true');
      this.counter++;
    }
    return next.handle(req).pipe(
      tap((event: HttpResponse<any>) => {
        if (event.url) {
          if (event.url.indexOf('api') > -1) {
            this.counter--;
            if (this.counter === 0) {
              setTimeout(() => {
                this.dbLoadStatusService.$statusPreloadingData.next('false');
              }, 50);
            }
          }
        }
      }
    )
    );
  }
}

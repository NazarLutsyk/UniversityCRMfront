import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {NotificationService} from '../notification.service';
import {NotificationType} from '../../core/notifications/notification-type';

@Injectable()
export class CheckResponseInterceptorService implements HttpInterceptor {

  constructor(
    private notificationService: NotificationService
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('req');
    if (req.url.indexOf('api') > -1) {
      // console.log(req.url.indexOf('api'));
    } else {
      // console.log(req);
    }
    return next.handle(req).pipe(
      tap((event: HttpResponse<any>) => {
        if (event.url) {
          if (event.url.indexOf('api') > -1) {


            // console.log(req.url.indexOf('api'));
          } else {

            // console.log(req);
          }
          console.log(event);
        }
      }
    )
    );
  }
}

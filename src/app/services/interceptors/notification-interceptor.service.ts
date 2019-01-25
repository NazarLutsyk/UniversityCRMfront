import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {NotificationService} from '../notification.service';
import {NotificationType} from '../../core/notifications/notification-type';

@Injectable()
export class NotificationInterceptorService implements HttpInterceptor {

  constructor(
    private notificationService: NotificationService
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap((event: HttpEvent<any>) => {
      }, (err: any) => {
        if (err instanceof HttpErrorResponse) {
          this.notificationService.$notificationData.next({
            type: NotificationType.ERROR,
            date: new Date,
            text: `${err.status}: ${err.error.message} - ${err.error.name}`
          });
        }
      })
    );
  }
}

import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {NotificationData} from '../core/notifications/notification-data';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  $notificationData = new Subject<NotificationData>();

  constructor() {
  }
}

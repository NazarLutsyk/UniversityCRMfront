import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NotificationData} from '../notification-data';
import {NotificationType} from '../notification-type';

@Component({
  selector: 'app-single-notification',
  templateUrl: './single-notification.component.html',
  styleUrls: ['./single-notification.component.css']
})
export class SingleNotificationComponent implements OnInit {

  notificationTypes = NotificationType;
  @Input() notification: NotificationData;

  @Output() onCloseNotification = new EventEmitter<NotificationData>();

  constructor() {
  }

  ngOnInit() {
  }

  closeNotification() {
    this.onCloseNotification.emit(this.notification);
  }
}

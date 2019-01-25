import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {NotificationService} from '../../services/notification.service';
import {NotificationData} from './notification-data';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  notifications: NotificationData[] = [];

  @Output() onNotification = new EventEmitter();

  constructor(
    private notificationService: NotificationService
  ) {
  }

  ngOnInit() {
    this.notificationService.$notificationData.subscribe((notification) => {
      this.notifications.push(notification);
      this.onNotification.emit();
    });
  }

  closeNotification(notification: NotificationData) {
    const toDeleteIndex = this.notifications.findIndex(n => n.type === notification.type && n.text === notification.text);
    this.notifications.splice(toDeleteIndex, 1);
  }

}

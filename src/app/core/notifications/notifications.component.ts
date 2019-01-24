import {Component, OnInit} from '@angular/core';
import {NotificationService} from '../../services/notification.service';
import {NotificationData} from './notification-data';
import {NotificationType} from './notification-type';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  notifications: NotificationData[] = [
    {
      text: 'User created',
      type: NotificationType.INFO,
      date: new Date()
    },
    {
      text: 'Cannot send email',
      type: NotificationType.ERROR,
      date: new Date()
    }];

  constructor(
    private notificationService: NotificationService
  ) {
  }

  ngOnInit() {
    this.notificationService.$notificationData.subscribe((notification) => {
      this.notifications.push(notification);
    });
  }


}

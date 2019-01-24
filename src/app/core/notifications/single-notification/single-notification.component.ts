import {Component, Input, OnInit} from '@angular/core';
import {NotificationData} from '../notification-data';

@Component({
  selector: 'app-single-notification',
  templateUrl: './single-notification.component.html',
  styleUrls: ['./single-notification.component.css']
})
export class SingleNotificationComponent implements OnInit {

  @Input() notification: NotificationData;

  constructor() {
  }

  ngOnInit() {
  }

}

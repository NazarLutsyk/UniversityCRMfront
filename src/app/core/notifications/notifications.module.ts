import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsComponent } from './notifications.component';
import { SingleNotificationComponent } from './single-notification/single-notification.component';
import {MatIconModule} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule
  ],
  declarations: [NotificationsComponent, SingleNotificationComponent],
  exports: [NotificationsComponent]
})
export class NotificationsModule { }

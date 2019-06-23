import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HomeComponent} from './home/home.component';
import {ClientsModule} from './clients/clients.module';
import {BreadcrumbsComponent} from './breadcrumbs/breadcrumbs.component';
import {RouterModule} from '@angular/router';
import {TasksModule} from './tasks/tasks.module';
import {GroupsModule} from './groups/groups.module';
import {ApplicationsModule} from './applications/applications.module';
import {CoursesModule} from './courses/courses.module';
import {SourcesModule} from './sources/sources.module';
import {DeleteSnackBarComponent} from './delete-snack-bar/delete-snack-bar.component';
import {MatButtonModule, MatDatepickerModule, MatFormFieldModule, MatSnackBarModule} from '@angular/material';
import {CitiesModule} from './cities/cities.module';
import {ManagersModule} from './managers/managers.module';
import {AuthModule} from './auth/auth.module';
import {EApplicationsModule} from './e-applications/e-applications.module';
import {SendingModule} from './sending/sending.module';
import {AudioCallsModule} from './audio-calls/audio-calls.module';
import {UfileModule} from './ufile/ufile.module';
import {UfileComponent} from './ufile/ufile.component';
import {NotificationsModule} from './notifications/notifications.module';
import {NotificationsComponent} from './notifications/notifications.component';
import {UpdateSocialComponent} from './social/update-social/update-social.component';
import {UpdateTaskComponent} from './tasks/update-task/update-task.component';
import {UpdateAudioCallComponent} from './audio-calls/update-audio-call/update-audio-call.component';
import {UpdateCommentComponent} from './comments/update-comment/update-comment.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CompetitorsModule} from './competitors/competitors.module';
import {CompetitorApplicationsModule} from './competitor-applications/competitor-applications.module';
import {ClientMatchDialogComponent} from './clients/client-match-dialog/client-match-dialog.component';
import {PaymentUpdateComponent} from './payments/payment-update/payment-update.component';
import {RatingsModule} from './ratings/ratings.module';
import { PreloadComponent } from './preload/preload.component';
import {ClientsStatusesModule} from './clients-statuses/clients-statuses.module';
import {ReportsModule} from './reports/reports.module';
import {FormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    RouterModule,
    ClientsModule,
    TasksModule,
    ApplicationsModule,
    GroupsModule,
    CoursesModule,
    SourcesModule,
    CitiesModule,
    ManagersModule,
    AuthModule,
    EApplicationsModule,
    SendingModule,
    AudioCallsModule,
    UfileModule,
    NotificationsModule,
    MatSnackBarModule,
    MatButtonModule,
    CompetitorsModule,
    CompetitorApplicationsModule,
    RatingsModule,
    ClientsStatusesModule,
    ReportsModule,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule
  ],
  declarations: [
    HomeComponent,
    BreadcrumbsComponent,
    DeleteSnackBarComponent,
    PreloadComponent
  ],
  entryComponents: [
    DeleteSnackBarComponent,
    UfileComponent,
    UpdateSocialComponent,
    UpdateTaskComponent,
    UpdateAudioCallComponent,
    UpdateCommentComponent,
    ClientMatchDialogComponent,
    PaymentUpdateComponent
  ],
  exports: [
    BreadcrumbsComponent,
    NotificationsComponent,
    PreloadComponent
  ]
})
export class CoreModule {
}

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ClientsComponent} from './clients.component';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatInputModule,
  MatNativeDateModule,
  MatSelectModule,
  MatSnackBarModule
} from '@angular/material';
import {FormsModule} from '@angular/forms';
import {SingleClientComponent} from './single-client/single-client.component';
import {TasksModule} from '../tasks/tasks.module';
import {CommentsModule} from '../comments/comments.module';
import {ApplicationsModule} from '../applications/applications.module';
import {AudioCallsModule} from '../audio-calls/audio-calls.module';
import {UfileModule} from '../ufile/ufile.module';
import {SocialModule} from '../social/social.module';
import {ClientMatchDialogComponent} from './client-match-dialog/client-match-dialog.component';
import {SharedModule} from '../../shared/shared.module';
import { ClientsMapComponent } from './clients-map/clients-map.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatSelectModule,
    MatCheckboxModule,
    TasksModule,
    CommentsModule,
    ApplicationsModule,
    AudioCallsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    UfileModule,
    SocialModule,
    SharedModule
  ],
  declarations: [
    ClientsComponent,
    SingleClientComponent,
    ClientMatchDialogComponent,
    ClientsMapComponent,
  ]
})
export class ClientsModule {
}

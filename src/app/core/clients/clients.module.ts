import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ClientsComponent} from './clients.component';
import {
  MatButtonModule, MatCheckboxModule, MatDatepickerModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatInputModule, MatNativeDateModule,
  MatSelectModule,
  MatSnackBarModule
} from '@angular/material';
import {FormsModule} from '@angular/forms';
import {SingleClientComponent} from './single-client/single-client.component';
import {TasksModule} from '../tasks/tasks.module';
import {CommentsModule} from '../comments/comments.module';
import {ApplicationsModule} from '../applications/applications.module';

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
    MatDatepickerModule,
    MatNativeDateModule
  ],
  declarations: [
    ClientsComponent,
    SingleClientComponent
  ]
})
export class ClientsModule {
}

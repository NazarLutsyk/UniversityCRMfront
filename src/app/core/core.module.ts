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

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ClientsModule,
    TasksModule,
    ApplicationsModule,
    GroupsModule,
    CoursesModule,
    SourcesModule
  ],
  declarations: [
    HomeComponent,
    BreadcrumbsComponent,
  ],
  exports: [
    BreadcrumbsComponent
  ]
})
export class CoreModule {
}

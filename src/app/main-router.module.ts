import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './core/home/home.component';
import {ClientsComponent} from './core/clients/clients.component';
import {CoreModule} from './core/core.module';
import {SingleClientComponent} from './core/clients/single-client/single-client.component';
import {TasksComponent} from './core/tasks/tasks.component';
import {ApplicationsComponent} from './core/applications/applications.component';
import {GroupsComponent} from './core/groups/groups.component';
import {CoursesComponent} from './core/courses/courses.component';
import {SourcesComponent} from './core/sources/sources.component';

const routes: Routes = [
  {path: '', component: HomeComponent, data: {breadcrumb: 'Home'}},
  {
    path: 'clients', data: {breadcrumb: 'Clients'}, children:
      [
        {path: '', component: ClientsComponent},
        {path: ':id', component: SingleClientComponent, data: {breadcrumb: 'Client'}},
      ]
  },
  {
    path: 'applications', data: {breadcrumb: 'Applications'}, children:
      [
        {path: '', component: ApplicationsComponent},
        // {path: ':id', component: SingleClientComponent, data: {breadcrumb: 'Client'}},
      ]
  },
  {
    path: 'groups', data: {breadcrumb: 'Groups'}, children:
      [
        {path: '', component: GroupsComponent},
        // {path: ':id', component: SingleClientComponent, data: {breadcrumb: 'Client'}},
      ]
  },
  {
    path: 'courses', data: {breadcrumb: 'Courses'}, children:
      [
        {path: '', component: CoursesComponent},
        // {path: ':id', component: SingleClientComponent, data: {breadcrumb: 'Client'}},
      ]
  },
  {
    path: 'sources', data: {breadcrumb: 'Sources'}, children:
      [
        {path: '', component: SourcesComponent},
        // {path: ':id', component: SingleClientComponent, data: {breadcrumb: 'Client'}},
      ]
  },
  {
    path: 'tasks', data: {breadcrumb: 'Tasks'}, children:
      [
        {path: '', component: TasksComponent},
        // {path: ':id', component: SingleClientComponent, data: {breadcrumb: 'Client'}},
      ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
    CoreModule
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class MainRouterModule {
}

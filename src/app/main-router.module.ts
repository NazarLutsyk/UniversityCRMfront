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
import {SingleTaskComponent} from './core/tasks/single-task/single-task.component';
import {SingleSourceComponent} from './core/sources/single-source/single-source.component';
import {SingleCourseComponent} from './core/courses/single-course/single-course.component';
import {SingleGroupComponent} from './core/groups/single-group/single-group.component';
import {SingleApplicationComponent} from './core/applications/single-application/single-application.component';
import {SingleLessonComponent} from './core/lessons/single-lesson/single-lesson.component';
import {CitiesComponent} from './core/cities/cities.component';
import {SingleCityComponent} from './core/cities/single-city/single-city.component';
import {ManagersComponent} from './core/managers/managers.component';
import {SingleManagerComponent} from './core/managers/single-manager/single-manager.component';
import {LoginComponent} from './core/auth/login/login.component';
import {AuthenticatedGuard} from './services/guards/authenticated.guard';
import {NotAuthenticatedGuard} from './services/guards/not-authenticated.guard';
import {Roles} from './models/roles';
import {RoleGuard} from './services/guards/role.guard';

const routes: Routes = [
  {path: '', component: HomeComponent, data: {breadcrumb: 'Home'}},
  {
    path: 'clients',
    data: {breadcrumb: 'Clients'},
    canActivate: [AuthenticatedGuard],
    children:
      [
        {path: '', component: ClientsComponent},
        {path: ':id', component: SingleClientComponent, data: {breadcrumb: 'Client'}},
      ]
  },
  {
    path: 'tasks',
    data: {breadcrumb: 'Tasks', expectedRoles: [Roles.BOSS_ROLE, Roles.MANAGER_ROLE]},
    canActivate: [AuthenticatedGuard, RoleGuard],
    children:
      [
        {path: '', component: TasksComponent},
        {path: ':id', component: SingleTaskComponent, data: {breadcrumb: 'Task'}},
      ]
  },
  {
    path: 'applications',
    data: {breadcrumb: 'Applications', expectedRoles: [Roles.BOSS_ROLE, Roles.MANAGER_ROLE]},
    canActivate: [AuthenticatedGuard, RoleGuard],
    children:
      [
        {path: '', component: ApplicationsComponent},
        {path: ':id', component: SingleApplicationComponent, data: {breadcrumb: 'Application'}},
      ]
  },
  {
    path: 'groups',
    data: {breadcrumb: 'Groups', expectedRoles: [Roles.BOSS_ROLE, Roles.MANAGER_ROLE, Roles.TEACHER_ROLE]},
    canActivate: [AuthenticatedGuard, RoleGuard],
    children:
      [
        {path: '', component: GroupsComponent},
        {path: ':id', component: SingleGroupComponent, data: {breadcrumb: 'Group'}},
        {path: ':id/lessons/:lessonId', component: SingleLessonComponent, data: {breadcrumb: 'Lesson'}},
      ]
  },
  {
    path: 'courses',
    data: {breadcrumb: 'Courses', expectedRoles: [Roles.BOSS_ROLE, Roles.MANAGER_ROLE, Roles.TEACHER_ROLE]},
    canActivate: [AuthenticatedGuard, RoleGuard],
    children:
      [
        {path: '', component: CoursesComponent},
        {path: ':id', component: SingleCourseComponent, data: {breadcrumb: 'Course'}},
      ]
  },
  {
    path: 'sources',
    data: {breadcrumb: 'Sources', expectedRoles: [Roles.BOSS_ROLE, Roles.MANAGER_ROLE]},
    canActivate: [AuthenticatedGuard, RoleGuard],
    children:
      [
        {path: '', component: SourcesComponent},
        {path: ':id', component: SingleSourceComponent, data: {breadcrumb: 'Source'}},
      ]
  },
  {
    path: 'cities',
    data: {breadcrumb: 'Cities', expectedRoles: [Roles.BOSS_ROLE, Roles.MANAGER_ROLE]},
    canActivate: [AuthenticatedGuard, RoleGuard],
    children:
      [
        {path: '', component: CitiesComponent},
        {path: ':id', component: SingleCityComponent, data: {breadcrumb: 'City'}},
      ]
  },
  {
    path: 'managers',
    data: {breadcrumb: 'Managers', expectedRoles: [Roles.BOSS_ROLE]},
    canActivate: [AuthenticatedGuard, RoleGuard],
    children:
      [
        {path: '', component: ManagersComponent},
        {path: ':id', component: SingleManagerComponent, data: {breadcrumb: 'Manager'}},
      ]
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [NotAuthenticatedGuard],
    data: {
      breadcrumb: 'Login'
    }
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

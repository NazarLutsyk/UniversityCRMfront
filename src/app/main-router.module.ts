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
import {EApplicationsComponent} from './core/e-applications/e-applications.component';
import {SendingComponent} from './core/sending/sending.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CompetitorsComponent} from './core/competitors/competitors.component';
import {SingleCompetitorComponent} from './core/competitors/single-competitor/single-competitor.component';
import {CompetitorApplicationsComponent} from './core/competitor-applications/competitor-applications.component';
import {SingleCompetitorApplicationComponent} from './core/competitor-applications/single-competitor-application/single-competitor-application.component';
import {PaymentsComponent} from './core/payments/payments.component';
import {RatingsComponent} from './core/ratings/ratings.component';
import {SingleRatingComponent} from './core/ratings/single-rating/single-rating.component';
import {SingleRatingInfoComponent} from './core/ratings/single-rating-info/single-rating-info.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: {
      breadcrumb: 'Home'
    }
  },
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
    path: 'e-applications',
    data: {breadcrumb: 'EApplications', expectedRoles: [Roles.BOSS_ROLE, Roles.MANAGER_ROLE]},
    canActivate: [AuthenticatedGuard, RoleGuard],
    component: EApplicationsComponent
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
      breadcrumb: 'Login',
    }
  },
  {
    path: 'sending',
    component: SendingComponent,
    canActivate: [AuthenticatedGuard, RoleGuard],
    data: {
      breadcrumb: 'Sending',
      expectedRoles: [Roles.BOSS_ROLE, Roles.MANAGER_ROLE]
    }
  },
  {
    path: 'competitors',
    canActivate: [AuthenticatedGuard, RoleGuard],
    data: {breadcrumb: 'Competitors', expectedRoles: [Roles.BOSS_ROLE, Roles.MANAGER_ROLE]},
    children:
      [
        {path: '', component: CompetitorsComponent},
        {path: ':id', component: SingleCompetitorComponent, data: {breadcrumb: 'Competitor'}},
      ]
  },
  {
    path: 'competitor-applications',
    canActivate: [AuthenticatedGuard, RoleGuard],
    data: {breadcrumb: 'Applications', expectedRoles: [Roles.BOSS_ROLE, Roles.MANAGER_ROLE]},
    children:
      [
        {path: '', component: CompetitorApplicationsComponent},
        {path: ':id', component: SingleCompetitorApplicationComponent, data: {breadcrumb: 'Application'}},
      ]
  },
  {
    path: 'payments',
    component: PaymentsComponent,
    canActivate: [AuthenticatedGuard, RoleGuard],
    data: {
      breadcrumb: 'Payments',
      expectedRoles: [Roles.BOSS_ROLE, Roles.MANAGER_ROLE]
    },
  },
  {
    path: 'ratings',
    canActivate: [AuthenticatedGuard],
    data: {breadcrumb: 'Ratings'},
    children:
      [
        {path: '', component: RatingsComponent},
        {path: ':id', component: SingleRatingComponent, data: {breadcrumb: 'Rating'}},
        {path: 'info/:id', component: SingleRatingInfoComponent, data: {breadcrumb: 'Info'}},
      ]
  },
];

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes, {scrollPositionRestoration: 'top'}),
    CoreModule
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class MainRouterModule {
}

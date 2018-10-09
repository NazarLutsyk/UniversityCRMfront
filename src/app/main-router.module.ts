import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './core/home/home.component';
import {ClientsComponent} from './core/clients/clients.component';
import {CoreModule} from './core/core.module';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'clients', component: ClientsComponent},
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
export class MainRouterModule { }

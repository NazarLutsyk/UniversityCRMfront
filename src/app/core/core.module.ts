import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HomeComponent} from './home/home.component';
import {ClientsComponent} from './clients/clients.component';
import {FormsModule} from '@angular/forms';
import {MatButtonModule, MatExpansionModule, MatFormFieldModule, MatInputModule} from '@angular/material';
import {MaterialTableModule} from './material-table/material-table.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    MatButtonModule,
    MaterialTableModule
  ],
  declarations: [
    HomeComponent,
    ClientsComponent
  ]
})
export class CoreModule {
}

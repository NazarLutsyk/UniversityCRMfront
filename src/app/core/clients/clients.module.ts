import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialTableModule} from '../material-table/material-table.module';
import {ClientsComponent} from './clients.component';
import {MatButtonModule, MatExpansionModule, MatFormFieldModule, MatInputModule} from '@angular/material';
import {FormsModule} from '@angular/forms';
import { SingleClientComponent } from './single-client/single-client.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialTableModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule
  ],
  declarations: [
    ClientsComponent,
    SingleClientComponent
  ]
})
export class ClientsModule {
}

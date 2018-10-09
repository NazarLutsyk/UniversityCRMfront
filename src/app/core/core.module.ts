import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { ClientsComponent } from './clients/clients.component';
import {FormsModule} from '@angular/forms';
import {MatButtonModule, MatExpansionModule, MatFormFieldModule, MatInputModule} from '@angular/material';
import { MaterialTableComponent } from './material-table/material-table.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    MatButtonModule,
  ],
  declarations: [HomeComponent, ClientsComponent, MaterialTableComponent]
})
export class CoreModule { }

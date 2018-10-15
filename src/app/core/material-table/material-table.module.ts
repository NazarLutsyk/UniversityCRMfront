import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialTableComponent} from './material-table.component';
import {DeleteSnackBarComponent} from './delete-snack-bar/delete-snack-bar.component';
import {MatButtonModule, MatFormFieldModule, MatInputModule, MatSnackBarModule} from '@angular/material';
import {FormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    MatSnackBarModule,
    MatButtonModule,
    MatInputModule,
    FormsModule,
    MatFormFieldModule,
  ],
  declarations: [
    MaterialTableComponent,
    DeleteSnackBarComponent
  ],
  entryComponents: [
      DeleteSnackBarComponent
  ],
  exports: [
    MaterialTableComponent
  ]
})
export class MaterialTableModule {
}

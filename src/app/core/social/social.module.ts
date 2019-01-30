import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocialTableComponent } from './social-table/social-table.component';
import {FormsModule} from '@angular/forms';
import {MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule} from '@angular/material';
import { UpdateSocialComponent } from './update-social/update-social.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule
  ],
  declarations: [SocialTableComponent, UpdateSocialComponent],
  exports: [SocialTableComponent]
})
export class SocialModule { }
